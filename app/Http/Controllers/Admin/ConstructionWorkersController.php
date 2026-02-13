<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ConstructionProject;
use App\Models\ConstructionWorker;
use App\Models\ConstructionWorkerDocument;
use App\Models\ConstructionWorkerGroup;
use Illuminate\Http\Request;

class ConstructionWorkersController extends Controller
{
    private function docTypes(): array
    {
        return [
            'nida',
            'id_passport',
            'work_permit',
            'safety_training',
        ];
    }

    public function groups(Request $request)
    {
        $q = (string) $request->query('q', '');

        $groups = ConstructionWorkerGroup::query()
            ->when($q !== '', fn ($query) => $query->where('name', 'like', "%{$q}%"))
            ->withCount('workers')
            ->orderBy('name')
            ->limit(500)
            ->get()
            ->map(fn (ConstructionWorkerGroup $g) => [
                'id' => $g->id,
                'name' => $g->name,
                'type' => $g->type,
                'workers_count' => $g->workers_count,
            ])
            ->values();

        return response()->json([
            'groups' => $groups,
        ]);
    }

    public function storeGroup(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:180'],
            'type' => ['required', 'string', 'max:30'],
        ]);

        $g = ConstructionWorkerGroup::query()->create([
            'name' => $validated['name'],
            'type' => $validated['type'],
        ]);

        return response()->json([
            'ok' => true,
            'group' => [
                'id' => $g->id,
                'name' => $g->name,
                'type' => $g->type,
            ],
        ], 201);
    }

    public function updateGroup(Request $request, ConstructionWorkerGroup $group)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:180'],
            'type' => ['required', 'string', 'max:30'],
        ]);

        $group->update([
            'name' => $validated['name'],
            'type' => $validated['type'],
        ]);

        return response()->json([
            'ok' => true,
        ]);
    }

    public function destroyGroup(Request $request, ConstructionWorkerGroup $group)
    {
        $group->delete();

        return response()->json([
            'ok' => true,
        ]);
    }

    public function groupDetails(Request $request, ConstructionWorkerGroup $group)
    {
        $group->load(['workers.documents']);
        $group->load(['projects:id,code,name']);

        $workers = $group->workers
            ->sortBy('name')
            ->values()
            ->map(function (ConstructionWorker $w) {
                $docsByType = $w->documents->keyBy('type');

                return [
                    'id' => $w->id,
                    'name' => $w->name,
                    'age' => $w->age,
                    'date_of_birth' => optional($w->date_of_birth)->format('Y-m-d'),
                    'nida' => $w->nida,
                    'documents' => collect($this->docTypes())->mapWithKeys(function ($t) use ($docsByType) {
                        $d = $docsByType->get($t);
                        return [
                            $t => [
                                'id' => $d?->id,
                                'type' => $t,
                                'status' => $d?->status ?? 'pending',
                                'expiry_date' => optional($d?->expiry_date)->format('Y-m-d'),
                                'notes' => $d?->notes,
                                'file_path' => $d?->file_path,
                            ],
                        ];
                    })->all(),
                ];
            });

        $projects = $group->projects->map(fn (ConstructionProject $p) => [
            'id' => $p->id,
            'code' => $p->code,
            'name' => $p->name,
        ])->values();

        return response()->json([
            'group' => [
                'id' => $group->id,
                'name' => $group->name,
                'type' => $group->type,
            ],
            'workers' => $workers,
            'projects' => $projects,
        ]);
    }

    public function storeWorker(Request $request)
    {
        $validated = $request->validate([
            'group_id' => ['required', 'integer', 'exists:construction_worker_groups,id'],
            'name' => ['required', 'string', 'max:180'],
            'age' => ['nullable', 'integer', 'min:0', 'max:120'],
            'date_of_birth' => ['nullable', 'date'],
            'nida' => ['nullable', 'string', 'max:80', 'unique:construction_workers,nida'],
        ]);

        $w = ConstructionWorker::query()->create([
            'group_id' => $validated['group_id'],
            'name' => $validated['name'],
            'age' => $validated['age'] ?? null,
            'date_of_birth' => $validated['date_of_birth'] ?? null,
            'nida' => $validated['nida'] ?? null,
        ]);

        foreach ($this->docTypes() as $t) {
            ConstructionWorkerDocument::query()->create([
                'worker_id' => $w->id,
                'type' => $t,
                'status' => 'pending',
            ]);
        }

        return response()->json([
            'ok' => true,
            'worker' => [
                'id' => $w->id,
            ],
        ], 201);
    }

    public function updateWorker(Request $request, ConstructionWorker $worker)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:180'],
            'age' => ['nullable', 'integer', 'min:0', 'max:120'],
            'date_of_birth' => ['nullable', 'date'],
            'nida' => ['nullable', 'string', 'max:80', 'unique:construction_workers,nida,' . $worker->id],
        ]);

        $worker->update([
            'name' => $validated['name'],
            'age' => $validated['age'] ?? null,
            'date_of_birth' => $validated['date_of_birth'] ?? null,
            'nida' => $validated['nida'] ?? null,
        ]);

        return response()->json(['ok' => true]);
    }

    public function destroyWorker(Request $request, ConstructionWorker $worker)
    {
        $worker->delete();

        return response()->json(['ok' => true]);
    }

    public function updateDocument(Request $request, ConstructionWorkerDocument $document)
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'max:30'],
            'expiry_date' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
            'file_path' => ['nullable', 'string', 'max:500'],
        ]);

        $document->update([
            'status' => $validated['status'],
            'expiry_date' => $validated['expiry_date'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'file_path' => $validated['file_path'] ?? null,
        ]);

        return response()->json(['ok' => true]);
    }

    public function projects(Request $request)
    {
        $rows = ConstructionProject::query()
            ->orderByDesc('id')
            ->limit(500)
            ->get(['id', 'code', 'name', 'status'])
            ->map(fn (ConstructionProject $p) => [
                'id' => $p->id,
                'code' => $p->code,
                'name' => $p->name,
                'status' => $p->status,
            ])
            ->values();

        return response()->json(['projects' => $rows]);
    }

    public function assignGroupToProject(Request $request, ConstructionWorkerGroup $group)
    {
        $validated = $request->validate([
            'project_id' => ['required', 'integer', 'exists:construction_projects,id'],
        ]);

        $group->projects()->syncWithoutDetaching([$validated['project_id']]);

        return response()->json(['ok' => true]);
    }

    public function unassignGroupFromProject(Request $request, ConstructionWorkerGroup $group)
    {
        $validated = $request->validate([
            'project_id' => ['required', 'integer', 'exists:construction_projects,id'],
        ]);

        $group->projects()->detach($validated['project_id']);

        return response()->json(['ok' => true]);
    }
}
