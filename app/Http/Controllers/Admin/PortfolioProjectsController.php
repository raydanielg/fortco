<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PortfolioProject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class PortfolioProjectsController extends Controller
{
    public function index(Request $request): InertiaResponse
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/Portfolio/Projects');
    }

    public function data(Request $request)
    {
        $q = (string) $request->query('q', '');
        $type = (string) $request->query('type', 'all');
        $published = (string) $request->query('published', 'all');

        $rows = PortfolioProject::query()
            ->when($q !== '', function ($query) use ($q) {
                $query->where(function ($qq) use ($q) {
                    $qq->where('name', 'like', "%{$q}%")
                        ->orWhere('slug', 'like', "%{$q}%")
                        ->orWhere('location', 'like', "%{$q}%")
                        ->orWhere('category', 'like', "%{$q}%");
                });
            })
            ->when($type !== '' && $type !== 'all', fn ($query) => $query->where('type', $type))
            ->when($published !== '' && $published !== 'all', fn ($query) => $query->where('is_published', $published === '1'))
            ->orderByDesc('id')
            ->limit(1000)
            ->get()
            ->map(fn (PortfolioProject $p) => [
                'id' => $p->id,
                'slug' => $p->slug,
                'type' => $p->type,
                'name' => $p->name,
                'location' => $p->location,
                'year' => $p->year,
                'category' => $p->category,
                'value' => $p->value,
                'expected' => $p->expected,
                'progress' => $p->progress,
                'is_published' => (bool) $p->is_published,
                'created_at' => optional($p->created_at)->toISOString(),
            ])
            ->values();

        return response()->json(['projects' => $rows]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => ['required', 'string', 'in:featured,ongoing'],
            'name' => ['required', 'string', 'max:200'],
            'slug' => ['nullable', 'string', 'max:220'],
            'location' => ['nullable', 'string', 'max:220'],
            'year' => ['nullable', 'integer', 'min:1900', 'max:2100'],
            'category' => ['nullable', 'string', 'max:120'],
            'value' => ['nullable', 'string', 'max:120'],
            'desc' => ['nullable', 'string'],
            'testimonial' => ['nullable', 'string'],
            'expected' => ['nullable', 'string', 'max:120'],
            'progress' => ['nullable', 'string', 'max:120'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['nullable', 'boolean'],
            'features' => ['nullable'],
            'occupied_by' => ['nullable'],
            'status_updates' => ['nullable'],
        ]);

        $slug = (string) ($validated['slug'] ?? '');
        if ($slug === '') {
            $slug = Str::slug($validated['name']);
        } else {
            $slug = Str::slug($slug);
        }
        if ($slug === '') {
            $slug = Str::random(10);
        }

        $base = $slug;
        $i = 1;
        while (PortfolioProject::query()->where('slug', $slug)->exists()) {
            $slug = $base . '-' . $i;
            $i++;
        }

        $features = $this->normalizeLinesToArray($validated['features'] ?? null);
        $occupied = $this->normalizeLinesToArray($validated['occupied_by'] ?? null);
        $statusUpdates = $this->normalizeStatusUpdates($validated['status_updates'] ?? null);

        $project = PortfolioProject::query()->create([
            'slug' => $slug,
            'type' => $validated['type'],
            'name' => $validated['name'],
            'location' => $validated['location'] ?? null,
            'year' => $validated['year'] ?? null,
            'category' => $validated['category'] ?? null,
            'value' => $validated['value'] ?? null,
            'desc' => $validated['desc'] ?? null,
            'testimonial' => $validated['testimonial'] ?? null,
            'expected' => $validated['expected'] ?? null,
            'progress' => $validated['progress'] ?? null,
            'sort_order' => $validated['sort_order'] ?? 0,
            'is_published' => array_key_exists('is_published', $validated) ? (bool) $validated['is_published'] : true,
            'features' => $features,
            'occupied_by' => $occupied,
            'status_updates' => $statusUpdates,
        ]);

        return response()->json([
            'ok' => true,
            'project' => [
                'id' => $project->id,
                'slug' => $project->slug,
            ],
        ], 201);
    }

    public function bulkDestroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer'],
        ]);

        $ids = array_values(array_unique($validated['ids']));
        PortfolioProject::query()->whereIn('id', $ids)->delete();

        return response()->json(['ok' => true, 'deleted' => count($ids)]);
    }

    public function export(Request $request)
    {
        $q = (string) $request->query('q', '');
        $type = (string) $request->query('type', 'all');
        $published = (string) $request->query('published', 'all');

        $rows = PortfolioProject::query()
            ->when($q !== '', function ($query) use ($q) {
                $query->where(function ($qq) use ($q) {
                    $qq->where('name', 'like', "%{$q}%")
                        ->orWhere('slug', 'like', "%{$q}%")
                        ->orWhere('location', 'like', "%{$q}%")
                        ->orWhere('category', 'like', "%{$q}%");
                });
            })
            ->when($type !== '' && $type !== 'all', fn ($query) => $query->where('type', $type))
            ->when($published !== '' && $published !== 'all', fn ($query) => $query->where('is_published', $published === '1'))
            ->orderByDesc('id')
            ->limit(5000)
            ->get();

        $handle = fopen('php://temp', 'w+');
        fputcsv($handle, ['ID', 'Slug', 'Type', 'Name', 'Location', 'Year', 'Category', 'Value', 'Expected', 'Progress', 'Published', 'Created At']);

        foreach ($rows as $p) {
            fputcsv($handle, [
                $p->id,
                $p->slug,
                $p->type,
                $p->name,
                $p->location,
                $p->year,
                $p->category,
                $p->value,
                $p->expected,
                $p->progress,
                $p->is_published ? 1 : 0,
                optional($p->created_at)->toDateTimeString(),
            ]);
        }

        rewind($handle);
        $csv = stream_get_contents($handle);
        fclose($handle);

        $fileName = 'portfolio-projects-' . now()->format('Y-m-d_His') . '.csv';

        return Response::make($csv, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
        ]);
    }

    private function normalizeLinesToArray($value): array
    {
        if ($value === null) return [];
        if (is_array($value)) return array_values(array_filter(array_map('strval', $value)));

        $lines = preg_split("/\r\n|\n|\r/", (string) $value);
        return array_values(array_filter(array_map(fn ($x) => trim((string) $x), $lines)));
    }

    private function normalizeStatusUpdates($value): array
    {
        if ($value === null) return [];
        if (is_array($value)) {
            return array_values(array_filter(array_map(function ($x) {
                if (!is_array($x)) return null;
                $label = trim((string) ($x['label'] ?? ''));
                $val = trim((string) ($x['value'] ?? ''));
                if ($label === '' || $val === '') return null;
                return ['label' => $label, 'value' => $val];
            }, $value)));
        }

        $lines = preg_split("/\r\n|\n|\r/", (string) $value);
        $out = [];
        foreach ($lines as $line) {
            $line = trim((string) $line);
            if ($line === '') continue;
            $parts = preg_split('/\s*\|\s*/', $line);
            $label = trim((string) ($parts[0] ?? ''));
            $val = trim((string) ($parts[1] ?? ''));
            if ($label === '' || $val === '') continue;
            $out[] = ['label' => $label, 'value' => $val];
        }

        return $out;
    }
}
