<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DatabaseBackup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Symfony\Component\Process\Process;

class DatabaseBackupController extends Controller
{
    private function backupsDir(): string
    {
        return storage_path('app/private/db_backups');
    }

    private function ensureDir(): void
    {
        File::ensureDirectoryExists($this->backupsDir());
    }

    private function sanitizeFilename(string $name): string
    {
        $name = basename($name);
        $name = preg_replace('/[^A-Za-z0-9._-]/', '', $name) ?: '';
        return $name;
    }

    private function isAllowedBackupFile(string $name): bool
    {
        return str_ends_with($name, '.sql') || str_ends_with($name, '.sqlite');
    }

    private function connection(): array
    {
        $default = config('database.default');
        $c = config("database.connections.{$default}") ?: [];
        return is_array($c) ? $c : [];
    }

    private function driver(): string
    {
        return (string) ($this->connection()['driver'] ?? '');
    }

    private function assertSupported(): void
    {
        $driver = $this->driver();
        if (!in_array($driver, ['sqlite', 'mysql', 'mariadb', 'pgsql'], true)) {
            abort(422, 'This backup tool supports SQLite, MySQL/MariaDB, and PostgreSQL only.');
        }
    }

    public function index(Request $request)
    {
        $this->assertSupported();
        $this->ensureDir();

        $driver = $this->driver();

        $files = [];

        $rows = DatabaseBackup::query()->orderByDesc('id')->limit(200)->get();
        foreach ($rows as $r) {
            $name = (string) $r->filename;
            if (!$this->isAllowedBackupFile($name)) {
                continue;
            }
            $full = $this->backupsDir() . DIRECTORY_SEPARATOR . $name;
            $exists = File::exists($full);
            $files[$name] = [
                'name' => $name,
                'size' => $exists ? (int) File::size($full) : (int) $r->size_bytes,
                'modified_at' => $r->created_at?->toISOString(),
                'driver' => (string) $r->driver,
                'exists' => $exists,
            ];
        }

        foreach (File::files($this->backupsDir()) as $f) {
            $name = $f->getFilename();
            if (!$this->isAllowedBackupFile($name)) {
                continue;
            }
            if (isset($files[$name])) {
                continue;
            }
            $files[$name] = [
                'name' => $name,
                'size' => (int) $f->getSize(),
                'modified_at' => date('c', $f->getMTime()),
                'driver' => $driver,
                'exists' => true,
            ];
        }

        $files = array_values($files);
        usort($files, fn ($a, $b) => strcmp((string) $b['modified_at'], (string) $a['modified_at']));

        return response()->json([
            'driver' => $driver,
            'files' => $files,
        ]);
    }

    public function generate(Request $request)
    {
        $this->assertSupported();
        $this->ensureDir();

        $driver = $this->driver();
        $userId = $request->user()?->id;

        if ($driver === 'sqlite') {
            $dbPath = (string) ($this->connection()['database'] ?? '');
            if ($dbPath === '') {
                return response()->json(['message' => 'SQLite database path is not configured.'], 422);
            }

            $filename = 'db_backup_' . date('Y-m-d_His') . '_' . Str::random(6) . '.sqlite';
            $full = $this->backupsDir() . DIRECTORY_SEPARATOR . $filename;
            try {
                File::copy($dbPath, $full);
                DatabaseBackup::query()->create([
                    'filename' => $filename,
                    'driver' => 'sqlite',
                    'size_bytes' => (int) File::size($full),
                    'created_by' => $userId,
                    'source' => 'generated',
                ]);
            } catch (\Throwable $e) {
                @File::delete($full);
                return response()->json(['message' => 'Failed to generate SQLite backup.'], 500);
            }

            return response()->json([
                'generated' => true,
                'file' => $filename,
            ]);
        }

        $c = $this->connection();
        $host = (string) ($c['host'] ?? '127.0.0.1');
        $port = (string) ($c['port'] ?? '3306');
        $database = (string) ($c['database'] ?? '');
        $username = (string) ($c['username'] ?? '');
        $password = (string) ($c['password'] ?? '');

        if ($database === '' || $username === '') {
            return response()->json(['message' => 'Database credentials are not configured.'], 422);
        }

        $filename = 'db_backup_' . date('Y-m-d_His') . '_' . Str::random(6) . '.sql';
        $full = $this->backupsDir() . DIRECTORY_SEPARATOR . $filename;

        if ($driver === 'pgsql') {
            $args = [
                'pg_dump',
                '--host=' . $host,
                '--port=' . $port,
                '--username=' . $username,
                '--format=plain',
                '--no-owner',
                '--no-privileges',
                '--file=' . $full,
                $database,
            ];

            $p = new Process($args);
            $p->setTimeout(300);
            if ($password !== '') {
                $p->setEnv(['PGPASSWORD' => $password] + $p->getEnv());
            }

            try {
                $p->run();
            } catch (\Throwable $e) {
                return response()->json(['message' => 'Failed to run pg_dump.'], 500);
            }

            if (!$p->isSuccessful()) {
                @File::delete($full);
                return response()->json([
                    'message' => trim($p->getErrorOutput()) !== '' ? trim($p->getErrorOutput()) : 'pg_dump failed. Ensure pg_dump is installed and accessible.',
                ], 500);
            }

            DatabaseBackup::query()->create([
                'filename' => $filename,
                'driver' => 'pgsql',
                'size_bytes' => (int) File::size($full),
                'created_by' => $userId,
                'source' => 'generated',
            ]);

            return response()->json([
                'generated' => true,
                'file' => $filename,
            ]);
        }

        $args = [
            'mysqldump',
            '--host=' . $host,
            '--port=' . $port,
            '--user=' . $username,
            '--single-transaction',
            '--routines',
            '--triggers',
            '--events',
            '--default-character-set=utf8mb4',
            '--result-file=' . $full,
            $database,
        ];

        $p = new Process($args);
        $p->setTimeout(300);
        if ($password !== '') {
            $p->setEnv(['MYSQL_PWD' => $password] + $p->getEnv());
        }

        try {
            $p->run();
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Failed to run mysqldump.'], 500);
        }

        if (!$p->isSuccessful()) {
            @File::delete($full);
            return response()->json([
                'message' => trim($p->getErrorOutput()) !== '' ? trim($p->getErrorOutput()) : 'mysqldump failed. Ensure mysqldump is installed and accessible.',
            ], 500);
        }

        DatabaseBackup::query()->create([
            'filename' => $filename,
            'driver' => $driver,
            'size_bytes' => (int) File::size($full),
            'created_by' => $userId,
            'source' => 'generated',
        ]);

        return response()->json([
            'generated' => true,
            'file' => $filename,
        ]);
    }

    public function download(Request $request, string $file)
    {
        $this->assertSupported();
        $this->ensureDir();

        $name = $this->sanitizeFilename($file);
        if ($name === '' || !$this->isAllowedBackupFile($name)) {
            abort(404);
        }

        $full = $this->backupsDir() . DIRECTORY_SEPARATOR . $name;
        if (!File::exists($full)) {
            abort(404);
        }

        return response()->download($full, $name);
    }

    public function destroy(Request $request, string $file)
    {
        $this->assertSupported();
        $this->ensureDir();

        $name = $this->sanitizeFilename($file);
        if ($name === '' || !$this->isAllowedBackupFile($name)) {
            return response()->json(['message' => 'Invalid file.'], 422);
        }

        $full = $this->backupsDir() . DIRECTORY_SEPARATOR . $name;
        if (!File::exists($full)) {
            return response()->json(['message' => 'File not found.'], 404);
        }

        File::delete($full);
        DatabaseBackup::query()->where('filename', $name)->delete();

        return response()->json(['deleted' => true]);
    }

    public function restore(Request $request)
    {
        $this->assertSupported();
        $this->ensureDir();

        $validated = $request->validate([
            'backup' => ['required', 'file', 'max:51200'],
        ]);

        $uploaded = $validated['backup'];
        $path = $uploaded->getRealPath();
        if (!$path || !File::exists($path)) {
            return response()->json(['message' => 'Upload failed.'], 422);
        }

        $originalName = (string) ($uploaded->getClientOriginalName() ?? '');

        $c = $this->connection();
        $driver = $this->driver();

        if ($driver === 'sqlite' && !str_ends_with(strtolower($originalName), '.sqlite')) {
            return response()->json(['message' => 'For SQLite restore, please upload a .sqlite backup file.'], 422);
        }

        if ($driver !== 'sqlite' && !str_ends_with(strtolower($originalName), '.sql')) {
            return response()->json(['message' => 'For MySQL/PostgreSQL restore, please upload a .sql dump file.'], 422);
        }

        if ($driver === 'sqlite') {
            $dbPath = (string) ($c['database'] ?? '');
            if ($dbPath === '') {
                return response()->json(['message' => 'SQLite database path is not configured.'], 422);
            }

            try {
                File::ensureDirectoryExists(dirname($dbPath));
                File::copy($path, $dbPath);
            } catch (\Throwable $e) {
                return response()->json(['message' => 'Failed to restore SQLite database file.'], 500);
            }

            return response()->json(['restored' => true]);
        }

        $host = (string) ($c['host'] ?? '127.0.0.1');
        $port = (string) ($c['port'] ?? '3306');
        $database = (string) ($c['database'] ?? '');
        $username = (string) ($c['username'] ?? '');
        $password = (string) ($c['password'] ?? '');

        if ($database === '' || $username === '') {
            return response()->json(['message' => 'Database credentials are not configured.'], 422);
        }

        if ($driver === 'pgsql') {
            $args = [
                'psql',
                '--host=' . $host,
                '--port=' . $port,
                '--username=' . $username,
                '--dbname=' . $database,
            ];

            $p = new Process($args);
            $p->setTimeout(300);
            if ($password !== '') {
                $p->setEnv(['PGPASSWORD' => $password] + $p->getEnv());
            }

            try {
                $p->setInput(File::get($path));
                $p->run();
            } catch (\Throwable $e) {
                return response()->json(['message' => 'Failed to run psql import.'], 500);
            }

            if (!$p->isSuccessful()) {
                return response()->json([
                    'message' => trim($p->getErrorOutput()) !== '' ? trim($p->getErrorOutput()) : 'Restore failed. Ensure psql is installed and accessible.',
                ], 500);
            }

            return response()->json(['restored' => true]);
        }

        $args = [
            'mysql',
            '--host=' . $host,
            '--port=' . $port,
            '--user=' . $username,
            '--default-character-set=utf8mb4',
            $database,
        ];

        $p = new Process($args);
        $p->setTimeout(300);
        if ($password !== '') {
            $p->setEnv(['MYSQL_PWD' => $password] + $p->getEnv());
        }

        try {
            $p->setInput(File::get($path));
            $p->run();
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Failed to run mysql import.'], 500);
        }

        if (!$p->isSuccessful()) {
            return response()->json([
                'message' => trim($p->getErrorOutput()) !== '' ? trim($p->getErrorOutput()) : 'Restore failed. Ensure mysql client is installed and accessible.',
            ], 500);
        }

        return response()->json(['restored' => true]);
    }
}
