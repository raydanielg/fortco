<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\TaskEvaluation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;

class TasksDataController extends Controller
{
    public function show(Request $request, Task $task)
    {
        return response()->json([
            'task' => $task,
        ]);
    }

    public function list(Request $request)
    {
        $query = Task::query()
            ->whereNull('parent_task_id')
            ->withCount('subTasks')
            ->orderByDesc('created_at');

        // Logic for scoping tasks based on role can be added here
        // For now, list all tasks or user's tasks
        
        $tasks = $query->get();

        return response()->json([
            'tasks' => $tasks
        ]);
    }

    public function subTasks(Request $request, Task $task)
    {
        $subs = Task::query()
            ->where('parent_task_id', $task->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'sub_tasks' => $subs,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'priority' => ['nullable', 'string'],
            'due_at' => ['nullable', 'date'],
            'year' => ['nullable', 'integer', 'min:2000', 'max:2100'],
        ]);

        $task = Task::create([
            ...$validated,
            'year' => $validated['year'] ?? (int) Carbon::now()->year,
            'created_by' => Auth::id(),
            'status' => 'submitted'
        ]);

        return response()->json([
            'created' => true,
            'task' => $task
        ]);
    }

    public function storeSubTask(Request $request, Task $task)
    {
        if (in_array($task->status, ['submitted', 'approved'], true)) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
        ]);

        $sub = Task::create([
            'parent_task_id' => $task->id,
            'year' => $task->year,
            'title' => $validated['title'],
            'created_by' => Auth::id(),
            'status' => 'submitted',
        ]);

        return response()->json([
            'created' => true,
            'task' => $sub,
        ]);
    }

    public function update(Request $request, Task $task)
    {
        if (in_array($task->status, ['submitted', 'approved'], true)) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'status' => ['nullable', 'string', 'max:50'],
        ]);

        $task->forceFill([
            'title' => $validated['title'],
        ]);

        if (isset($validated['status'])) {
            $task->status = $validated['status'];
        }

        $task->save();

        return response()->json([
            'updated' => true,
            'task' => $task,
        ]);
    }

    public function destroy(Request $request, Task $task)
    {
        if (in_array($task->status, ['submitted', 'approved'], true)) {
            abort(403);
        }

        $task->delete();
        return response()->json(['deleted' => true]);
    }

    public function planning(Request $request)
    {
        $validated = $request->validate([
            'year' => ['nullable', 'integer', 'min:2000', 'max:2100'],
        ]);

        $year = $validated['year'] ?? (int) Carbon::now()->year;

        $tasks = Task::query()
            ->whereNull('parent_task_id')
            ->where('year', $year)
            ->with([
                'creator:id,name',
                'approver:id,name',
            ])
            ->withCount('subTasks')
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'year' => $year,
            'tasks' => $tasks,
        ]);
    }

    public function approve(Request $request, Task $task)
    {
        $user = Auth::user();
        if (!$user || (!$user->hasRole('Super Admin') && !$user->hasRole('Admin'))) {
            abort(403);
        }

        if ($task->parent_task_id !== null) {
            abort(422);
        }

        $task->approved_at = Carbon::now();
        $task->approved_by = $user->id;
        $task->status = 'approved';
        $task->save();

        Task::query()
            ->where('parent_task_id', $task->id)
            ->update([
                'approved_at' => $task->approved_at,
                'approved_by' => $task->approved_by,
                'status' => 'approved',
            ]);

        $task = $task->fresh([
            'creator:id,name',
            'approver:id,name',
        ])->loadCount('subTasks');

        return response()->json([
            'approved' => true,
            'task' => $task,
        ]);
    }

    public function rollback(Request $request, Task $task)
    {
        $user = Auth::user();
        if (!$user || (!$user->hasRole('Super Admin') && !$user->hasRole('Admin'))) {
            abort(403);
        }

        if ($task->parent_task_id !== null) {
            abort(422);
        }

        $task->approved_at = null;
        $task->approved_by = null;
        $task->status = 'rolled_back';
        $task->save();

        Task::query()
            ->where('parent_task_id', $task->id)
            ->update([
                'approved_at' => null,
                'approved_by' => null,
                'status' => 'rolled_back',
            ]);

        $task = $task->fresh([
            'creator:id,name',
            'approver:id,name',
        ])->loadCount('subTasks');

        return response()->json([
            'rolled_back' => true,
            'task' => $task,
        ]);
    }

    public function submit(Request $request, Task $task)
    {
        $user = Auth::user();
        if (!$user) {
            abort(403);
        }

        if ($task->parent_task_id !== null) {
            abort(422);
        }

        if ($task->created_by !== $user->id && !$user->hasRole('Super Admin') && !$user->hasRole('Admin')) {
            abort(403);
        }

        $task->approved_at = null;
        $task->approved_by = null;
        $task->status = 'submitted';
        $task->save();

        Task::query()
            ->where('parent_task_id', $task->id)
            ->update([
                'approved_at' => null,
                'approved_by' => null,
                'status' => 'submitted',
            ]);

        $task = $task->fresh([
            'creator:id,name',
            'approver:id,name',
        ])->loadCount('subTasks');

        return response()->json([
            'submitted' => true,
            'task' => $task,
        ]);
    }

    public function evaluation(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            abort(403);
        }

        $validated = $request->validate([
            'year' => ['nullable', 'integer', 'min:2000', 'max:2100'],
        ]);

        $year = $validated['year'] ?? (int) Carbon::now()->year;

        $tasks = Task::query()
            ->whereNull('parent_task_id')
            ->where('year', $year)
            ->where('status', 'approved')
            ->whereNotNull('approved_at')
            ->with([
                'creator:id,name',
                'approver:id,name',
            ])
            ->withMax([
                'evaluations as progress_percent' => function ($q) use ($user) {
                    $q->where('user_id', $user->id);
                }
            ], 'percent')
            ->withCount('subTasks')
            ->orderByDesc('approved_at')
            ->get();

        return response()->json([
            'year' => $year,
            'tasks' => $tasks,
        ]);
    }

    public function evaluationHistory(Request $request, Task $task)
    {
        $user = Auth::user();
        if (!$user) {
            abort(403);
        }

        if ($task->status !== 'approved') {
            abort(403);
        }

        if ($task->created_by !== $user->id && !$user->hasRole('Super Admin') && !$user->hasRole('Admin')) {
            abort(403);
        }

        $history = TaskEvaluation::query()
            ->where('task_id', $task->id)
            ->where('user_id', $user->id)
            ->orderByDesc('entry_date')
            ->orderByDesc('id')
            ->get();

        $current = (int) $history->max('percent');
        $remaining = max(0, 100 - $current);

        return response()->json([
            'task_id' => $task->id,
            'history' => $history,
            'total' => $current,
            'remaining' => $remaining,
        ]);
    }

    public function evaluationStore(Request $request, Task $task)
    {
        $user = Auth::user();
        if (!$user) {
            abort(403);
        }

        if ($task->status !== 'approved') {
            abort(403);
        }

        if ($task->created_by !== $user->id && !$user->hasRole('Super Admin') && !$user->hasRole('Admin')) {
            abort(403);
        }

        $validated = $request->validate([
            'percent' => ['required', 'integer', 'min:1', 'max:100'],
            'entry_date' => ['nullable', 'date'],
        ]);

        $current = (int) TaskEvaluation::query()
            ->where('task_id', $task->id)
            ->where('user_id', $user->id)
            ->max('percent');

        $remaining = max(0, 100 - $current);
        if ((int) $validated['percent'] <= $current) {
            return response()->json([
                'message' => 'Percent must be greater than current progress.',
                'total' => $current,
                'remaining' => $remaining,
            ], 422);
        }

        if ((int) $validated['percent'] > 100) {
            return response()->json([
                'message' => 'Percent exceeds 100.',
                'total' => $current,
                'remaining' => $remaining,
            ], 422);
        }

        $entry = TaskEvaluation::create([
            'task_id' => $task->id,
            'user_id' => $user->id,
            'percent' => (int) $validated['percent'],
            'entry_date' => isset($validated['entry_date']) ? Carbon::parse($validated['entry_date'])->toDateString() : Carbon::now()->toDateString(),
        ]);

        $history = TaskEvaluation::query()
            ->where('task_id', $task->id)
            ->where('user_id', $user->id)
            ->orderByDesc('entry_date')
            ->orderByDesc('id')
            ->get();

        $newTotal = (int) $history->max('percent');
        $newRemaining = max(0, 100 - $newTotal);

        return response()->json([
            'created' => true,
            'entry' => $entry,
            'history' => $history,
            'total' => $newTotal,
            'remaining' => $newRemaining,
        ]);
    }
}
