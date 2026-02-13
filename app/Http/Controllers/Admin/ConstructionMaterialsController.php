<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ConstructionMaterial;
use Illuminate\Http\Request;

class ConstructionMaterialsController extends Controller
{
    public function data(Request $request)
    {
        $q = (string) $request->query('q', '');

        $materials = ConstructionMaterial::query()
            ->when($q !== '', function ($query) use ($q) {
                $query->where('name', 'like', "%{$q}%");
            })
            ->orderBy('name')
            ->limit(1000)
            ->get()
            ->map(fn (ConstructionMaterial $m) => [
                'id' => $m->id,
                'name' => $m->name,
                'unit' => $m->unit,
                'unit_rate' => $m->unit_rate,
                'created_at' => optional($m->created_at)->toISOString(),
            ])
            ->values();

        return response()->json([
            'materials' => $materials,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:180', 'unique:construction_materials,name'],
            'unit' => ['required', 'string', 'max:30'],
            'unit_rate' => ['nullable', 'numeric', 'min:0'],
        ]);

        $m = ConstructionMaterial::query()->create([
            'name' => $validated['name'],
            'unit' => $validated['unit'],
            'unit_rate' => $validated['unit_rate'] ?? null,
        ]);

        return response()->json([
            'ok' => true,
            'material' => [
                'id' => $m->id,
                'name' => $m->name,
                'unit' => $m->unit,
                'unit_rate' => $m->unit_rate,
            ],
        ], 201);
    }

    public function update(Request $request, ConstructionMaterial $material)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:180', 'unique:construction_materials,name,' . $material->id],
            'unit' => ['required', 'string', 'max:30'],
            'unit_rate' => ['nullable', 'numeric', 'min:0'],
        ]);

        $material->update([
            'name' => $validated['name'],
            'unit' => $validated['unit'],
            'unit_rate' => $validated['unit_rate'] ?? null,
        ]);

        return response()->json([
            'ok' => true,
            'material' => [
                'id' => $material->id,
                'name' => $material->name,
                'unit' => $material->unit,
                'unit_rate' => $material->unit_rate,
            ],
        ]);
    }

    public function destroy(Request $request, ConstructionMaterial $material)
    {
        $material->delete();

        return response()->json([
            'ok' => true,
        ]);
    }
}
