<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\SupportTicket;
use App\Models\SupportTicketMessage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SupportTicketsController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/Tickets/Index');
    }

    private function canAccessTicket(User $user, SupportTicket $ticket): bool
    {
        try {
            if ($user->hasRole('Super Admin')) {
                return true;
            }
        } catch (\Throwable $e) {
        }

        return (int) $ticket->creator_user_id === (int) $user->id || (int) $ticket->assignee_user_id === (int) $user->id;
    }

    public function list(Request $request)
    {
        $user = $request->user();

        $isSuperAdmin = false;
        try {
            $isSuperAdmin = $user?->hasRole('Super Admin') ?? false;
        } catch (\Throwable $e) {
            $isSuperAdmin = false;
        }

        $q = trim((string) $request->query('q', ''));

        $query = SupportTicket::query()
            ->with([
                'creator:id,name,email',
                'assignee:id,name,email',
            ])
            ->orderByDesc('updated_at');

        if (!$isSuperAdmin) {
            $query->where(function ($q2) use ($user) {
                $q2->where('creator_user_id', $user->id)
                    ->orWhere('assignee_user_id', $user->id);
            });
        }

        if ($q !== '') {
            $query->where(function ($q2) use ($q) {
                $q2->where('subject', 'like', '%'.$q.'%')
                    ->orWhere('description', 'like', '%'.$q.'%');
            });
        }

        $tickets = $query
            ->limit(200)
            ->get();

        $payload = $tickets->map(function (SupportTicket $t) {
            return [
                'id' => $t->id,
                'subject' => $t->subject,
                'status' => $t->status,
                'priority' => $t->priority,
                'created_at' => $t->created_at?->toISOString(),
                'updated_at' => $t->updated_at?->toISOString(),
                'creator' => $t->creator ? [
                    'id' => $t->creator->id,
                    'name' => $t->creator->name,
                    'email' => $t->creator->email,
                ] : null,
                'assignee' => $t->assignee ? [
                    'id' => $t->assignee->id,
                    'name' => $t->assignee->name,
                    'email' => $t->assignee->email,
                ] : null,
            ];
        })->values();

        return response()->json([
            'tickets' => $payload,
            'is_super_admin' => $isSuperAdmin,
        ]);
    }

    public function assignees(Request $request)
    {
        $employees = Employee::query()
            ->with(['user:id,name,email'])
            ->orderBy('full_name')
            ->limit(300)
            ->get(['id', 'user_id', 'full_name']);

        $payload = $employees->map(function (Employee $e) {
            return [
                'id' => $e->user_id,
                'name' => $e->full_name,
                'email' => $e->user?->email,
            ];
        })->filter(fn ($u) => !empty($u['id']))->values();

        return response()->json([
            'assignees' => $payload,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'subject' => ['required', 'string', 'max:180'],
            'description' => ['nullable', 'string', 'max:4000'],
            'priority' => ['nullable', 'string', Rule::in(['low', 'normal', 'high'])],
            'assignee_user_id' => ['nullable', 'integer', Rule::exists('users', 'id')],
        ]);

        $ticket = SupportTicket::query()->create([
            'creator_user_id' => $user->id,
            'assignee_user_id' => $validated['assignee_user_id'] ?? null,
            'subject' => $validated['subject'],
            'description' => $validated['description'] ?? null,
            'priority' => $validated['priority'] ?? 'normal',
            'status' => 'open',
        ]);

        if (!empty($validated['description'])) {
            SupportTicketMessage::query()->create([
                'support_ticket_id' => $ticket->id,
                'user_id' => $user->id,
                'message' => $validated['description'],
            ]);
        }

        return response()->json([
            'created' => true,
            'ticket_id' => $ticket->id,
        ]);
    }

    public function show(Request $request, SupportTicket $ticket)
    {
        $user = $request->user();
        if (!$this->canAccessTicket($user, $ticket)) {
            abort(403);
        }

        $ticket->load(['creator:id,name,email', 'assignee:id,name,email']);

        $messages = SupportTicketMessage::query()
            ->where('support_ticket_id', $ticket->id)
            ->with(['user:id,name,email'])
            ->orderBy('id')
            ->limit(500)
            ->get();

        $payloadMessages = $messages->map(function (SupportTicketMessage $m) {
            return [
                'id' => $m->id,
                'message' => $m->message,
                'created_at' => $m->created_at?->toISOString(),
                'user' => $m->user ? [
                    'id' => $m->user->id,
                    'name' => $m->user->name,
                    'email' => $m->user->email,
                ] : null,
            ];
        })->values();

        return response()->json([
            'ticket' => [
                'id' => $ticket->id,
                'subject' => $ticket->subject,
                'description' => $ticket->description,
                'status' => $ticket->status,
                'priority' => $ticket->priority,
                'created_at' => $ticket->created_at?->toISOString(),
                'updated_at' => $ticket->updated_at?->toISOString(),
                'creator' => $ticket->creator ? [
                    'id' => $ticket->creator->id,
                    'name' => $ticket->creator->name,
                    'email' => $ticket->creator->email,
                ] : null,
                'assignee' => $ticket->assignee ? [
                    'id' => $ticket->assignee->id,
                    'name' => $ticket->assignee->name,
                    'email' => $ticket->assignee->email,
                ] : null,
            ],
            'messages' => $payloadMessages,
        ]);
    }

    public function message(Request $request, SupportTicket $ticket)
    {
        $user = $request->user();
        if (!$this->canAccessTicket($user, $ticket)) {
            abort(403);
        }

        $validated = $request->validate([
            'message' => ['required', 'string', 'max:4000'],
        ]);

        SupportTicketMessage::query()->create([
            'support_ticket_id' => $ticket->id,
            'user_id' => $user->id,
            'message' => $validated['message'],
        ]);

        $ticket->touch();

        return response()->json(['sent' => true]);
    }

    public function assign(Request $request, SupportTicket $ticket)
    {
        $user = $request->user();

        $isSuperAdmin = false;
        try {
            $isSuperAdmin = $user?->hasRole('Super Admin') ?? false;
        } catch (\Throwable $e) {
            $isSuperAdmin = false;
        }

        if (!$isSuperAdmin) {
            abort(403);
        }

        $validated = $request->validate([
            'assignee_user_id' => ['nullable', 'integer', Rule::exists('users', 'id')],
        ]);

        $ticket->assignee_user_id = $validated['assignee_user_id'] ?? null;
        $ticket->save();

        return response()->json(['assigned' => true]);
    }

    public function status(Request $request, SupportTicket $ticket)
    {
        $user = $request->user();
        if (!$this->canAccessTicket($user, $ticket)) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => ['required', 'string', Rule::in(['open', 'in_progress', 'resolved', 'closed'])],
        ]);

        $ticket->status = $validated['status'];
        $ticket->save();

        return response()->json(['updated' => true]);
    }
}
