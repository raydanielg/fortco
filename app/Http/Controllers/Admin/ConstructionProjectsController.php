<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ConstructionLocation;
use App\Models\ConstructionProject;
use App\Models\ConstructionProjectCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Str;

class ConstructionProjectsController extends Controller
{
    public function data(Request $request)
    {
        $q = (string) $request->query('q', '');
        $status = (string) $request->query('status', '');

        $projects = ConstructionProject::query()
            ->when($q !== '', function ($query) use ($q) {
                $query->where(function ($qq) use ($q) {
                    $qq->where('name', 'like', "%{$q}%")
                        ->orWhere('code', 'like', "%{$q}%");
                });
            })
            ->when($status !== '' && $status !== 'all', function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->orderByDesc('id')
            ->limit(500)
            ->get()
            ->map(fn (ConstructionProject $p) => [
                'id' => $p->id,
                'code' => $p->code,
                'name' => $p->name,
                'status' => $p->status,
                'start_date' => optional($p->start_date)->toDateString(),
                'end_date' => optional($p->end_date)->toDateString(),
                'budget' => $p->budget,
                'created_at' => optional($p->created_at)->toISOString(),
            ])
            ->values();

        return response()->json([
            'projects' => $projects,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => ['nullable', 'string', 'max:80', 'unique:construction_projects,code'],
            'category_id' => ['nullable', 'integer', 'exists:construction_project_categories,id'],
            'location_id' => ['nullable', 'integer', 'exists:construction_locations,id'],
            'name' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string'],
            'features' => ['nullable'],
            'status' => ['required', 'string', 'max:50'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
            'budget' => ['nullable', 'numeric', 'min:0'],
        ]);

        $code = (string) ($validated['code'] ?? '');
        if ($code === '') {
            $code = 'PRJ-' . now()->format('Y') . '-' . strtoupper(Str::random(6));
            while (ConstructionProject::query()->where('code', $code)->exists()) {
                $code = 'PRJ-' . now()->format('Y') . '-' . strtoupper(Str::random(6));
            }
        }

        $features = [];
        if (array_key_exists('features', $validated)) {
            if (is_array($validated['features'])) {
                $features = array_values(array_filter(array_map(fn ($x) => trim((string) $x), $validated['features'])));
            } else {
                $lines = preg_split("/\r\n|\n|\r/", (string) $validated['features']);
                $features = array_values(array_filter(array_map(fn ($x) => trim((string) $x), $lines)));
            }
        }

        $project = ConstructionProject::query()->create([
            'code' => $code,
            'category_id' => $validated['category_id'] ?? null,
            'location_id' => $validated['location_id'] ?? null,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'features' => $features,
            'status' => $validated['status'],
            'start_date' => $validated['start_date'] ?? null,
            'end_date' => $validated['end_date'] ?? null,
            'budget' => $validated['budget'] ?? null,
        ]);

        return response()->json([
            'ok' => true,
            'project' => [
                'id' => $project->id,
            ],
        ], 201);
    }

    public function categories(Request $request)
    {
        $rows = ConstructionProjectCategory::query()
            ->orderBy('name')
            ->get()
            ->map(fn (ConstructionProjectCategory $c) => [
                'id' => $c->id,
                'name' => $c->name,
                'created_at' => optional($c->created_at)->toISOString(),
            ])
            ->values();

        return response()->json(['categories' => $rows]);
    }

    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120', 'unique:construction_project_categories,name'],
        ]);

        $cat = ConstructionProjectCategory::query()->create([
            'name' => $validated['name'],
        ]);

        return response()->json([
            'ok' => true,
            'category' => [
                'id' => $cat->id,
                'name' => $cat->name,
            ],
        ], 201);
    }

    public function destroyCategory(Request $request, ConstructionProjectCategory $category)
    {
        $category->delete();

        return response()->json([
            'ok' => true,
        ]);
    }

    public function autoCreateLocations(Request $request)
    {
        $validated = $request->validate([
            'country' => ['required', 'string', 'max:180'],
        ]);

        $map = [
            'Tanzania' => [
                'Arusha',
                'Dar es Salaam',
                'Dodoma',
                'Geita',
                'Iringa',
                'Kagera',
                'Katavi',
                'Kigoma',
                'Kilimanjaro',
                'Lindi',
                'Manyara',
                'Mara',
                'Mbeya',
                'Morogoro',
                'Mtwara',
                'Mwanza',
                'Njombe',
                'Pwani (Coast)',
                'Rukwa',
                'Ruvuma',
                'Shinyanga',
                'Simiyu',
                'Singida',
                'Songwe',
                'Tabora',
                'Tanga',
                'Kaskazini Unguja',
                'Kusini Unguja',
                'Mjini Magharibi',
                'Kaskazini Pemba',
                'Kusini Pemba',
            ],
            'Kenya' => ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu'],
            'Uganda' => ['Kampala', 'Wakiso', 'Mukono', 'Jinja'],
            'Rwanda' => ['Kigali', 'Eastern Province', 'Northern Province', 'Western Province', 'Southern Province'],
        ];

        $country = $validated['country'];
        $regions = $map[$country] ?? [];

        $created = 0;
        foreach ($regions as $region) {
            $exists = ConstructionLocation::query()
                ->where('country', $country)
                ->where('name', $region)
                ->exists();

            if ($exists) {
                continue;
            }

            ConstructionLocation::query()->create([
                'name' => $region,
                'region' => $region,
                'country' => $country,
            ]);
            $created++;
        }

        return response()->json([
            'ok' => true,
            'created' => $created,
            'total' => count($regions),
        ]);
    }

    public function updateCategory(Request $request, ConstructionProjectCategory $category)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120', 'unique:construction_project_categories,name,' . $category->id],
        ]);

        $category->update([
            'name' => $validated['name'],
        ]);

        return response()->json([
            'ok' => true,
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
            ],
        ]);
    }

    public function locations(Request $request)
    {
        $rows = ConstructionLocation::query()
            ->orderBy('name')
            ->limit(500)
            ->get()
            ->map(fn (ConstructionLocation $l) => [
                'id' => $l->id,
                'name' => $l->name,
                'region' => $l->region,
                'country' => $l->country,
                'created_at' => optional($l->created_at)->toISOString(),
            ])
            ->values();

        return response()->json(['locations' => $rows]);
    }

    public function storeLocation(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:180'],
            'region' => ['nullable', 'string', 'max:180'],
            'country' => ['nullable', 'string', 'max:180'],
        ]);

        $loc = ConstructionLocation::query()->create([
            'name' => $validated['name'],
            'region' => $validated['region'] ?? null,
            'country' => $validated['country'] ?? null,
        ]);

        return response()->json([
            'ok' => true,
            'location' => [
                'id' => $loc->id,
                'name' => $loc->name,
                'region' => $loc->region,
                'country' => $loc->country,
            ],
        ], 201);
    }

    public function updateLocation(Request $request, ConstructionLocation $location)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:180'],
            'region' => ['nullable', 'string', 'max:180'],
            'country' => ['nullable', 'string', 'max:180'],
        ]);

        $location->update([
            'name' => $validated['name'],
            'region' => $validated['region'] ?? null,
            'country' => $validated['country'] ?? null,
        ]);

        return response()->json([
            'ok' => true,
            'location' => [
                'id' => $location->id,
                'name' => $location->name,
                'region' => $location->region,
                'country' => $location->country,
            ],
        ]);
    }

    public function destroyLocation(Request $request, ConstructionLocation $location)
    {
        $location->delete();

        return response()->json([
            'ok' => true,
        ]);
    }

    public function bulkDestroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer'],
        ]);

        $ids = array_values(array_unique($validated['ids']));

        ConstructionProject::query()->whereIn('id', $ids)->delete();

        return response()->json([
            'ok' => true,
            'deleted' => count($ids),
        ]);
    }

    public function destroy(Request $request, ConstructionProject $project)
    {
        $project->delete();

        return response()->json([
            'ok' => true,
        ]);
    }

    public function export(Request $request)
    {
        $q = (string) $request->query('q', '');
        $status = (string) $request->query('status', '');

        $rows = ConstructionProject::query()
            ->when($q !== '', function ($query) use ($q) {
                $query->where(function ($qq) use ($q) {
                    $qq->where('name', 'like', "%{$q}%")
                        ->orWhere('code', 'like', "%{$q}%");
                });
            })
            ->when($status !== '' && $status !== 'all', function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->orderByDesc('id')
            ->limit(5000)
            ->get();

        $handle = fopen('php://temp', 'w+');
        fputcsv($handle, ['ID', 'Code', 'Name', 'Status', 'Start Date', 'End Date', 'Budget', 'Created At']);

        foreach ($rows as $p) {
            fputcsv($handle, [
                $p->id,
                $p->code,
                $p->name,
                $p->status,
                optional($p->start_date)->toDateString(),
                optional($p->end_date)->toDateString(),
                $p->budget,
                optional($p->created_at)->toDateTimeString(),
            ]);
        }

        rewind($handle);
        $csv = stream_get_contents($handle);
        fclose($handle);

        $fileName = 'construction-projects-' . now()->format('Y-m-d_His') . '.csv';

        return Response::make($csv, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
        ]);
    }
}
