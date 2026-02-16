<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HelpdeskMessage;
use App\Models\HelpdeskAttachment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class HelpdeskMessagesController extends Controller
{
    public function conversations(Request $request)
    {
        $sessionAgg = [];
        try {
            $rows = DB::table('sessions')
                ->selectRaw('user_id, count(*) as sessions_count, max(last_activity) as last_activity')
                ->whereNotNull('user_id')
                ->groupBy('user_id')
                ->get();

            foreach ($rows as $r) {
                $sessionAgg[(int) $r->user_id] = [
                    'sessions_count' => (int) $r->sessions_count,
                    'last_activity' => $r->last_activity ? (int) $r->last_activity : null,
                ];
            }
        } catch (\Throwable $e) {
            $sessionAgg = [];
        }

        $ids = HelpdeskMessage::query()
            ->selectRaw('user_id, max(id) as last_id')
            ->groupBy('user_id')
            ->orderByDesc('last_id')
            ->limit(200)
            ->get();

        $lastIds = $ids->pluck('last_id')->values();

        $lastMessages = HelpdeskMessage::query()
            ->whereIn('id', $lastIds)
            ->get(['id', 'user_id', 'sender', 'message', 'created_at'])
            ->keyBy('user_id');

        $users = User::query()
            ->whereIn('id', $ids->pluck('user_id')->values())
            ->get(['id', 'name', 'email'])
            ->keyBy('id');

        $payload = $ids->map(function ($row) use ($users, $lastMessages, $sessionAgg) {
            $uid = (int) ($row->user_id ?? 0);
            $u = $users[$uid] ?? null;
            $m = $lastMessages[$uid] ?? null;

            $agg = $sessionAgg[$uid] ?? ['sessions_count' => 0, 'last_activity' => null];
            $lastActivityTs = $agg['last_activity'] ? (int) $agg['last_activity'] : null;
            $active = $lastActivityTs ? (time() - $lastActivityTs) <= (15 * 60) : false;
            $lastActivityIso = $lastActivityTs ? Carbon::createFromTimestamp($lastActivityTs)->toISOString() : null;

            return [
                'user' => $u ? [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                ] : [
                    'id' => $uid,
                    'name' => 'User #'.$uid,
                    'email' => null,
                ],
                'user_active' => $active,
                'user_last_activity' => $lastActivityIso,
                'last_message' => $m?->message,
                'last_sender' => $m?->sender,
                'last_at' => $m?->created_at?->toISOString(),
            ];
        })->values();

        return response()->json([
            'conversations' => $payload,
        ]);
    }

    public function messages(Request $request, User $user)
    {
        $sessionAgg = ['sessions_count' => 0, 'last_activity' => null];
        try {
            $row = DB::table('sessions')
                ->selectRaw('user_id, count(*) as sessions_count, max(last_activity) as last_activity')
                ->where('user_id', $user->id)
                ->groupBy('user_id')
                ->first();

            if ($row) {
                $sessionAgg = [
                    'sessions_count' => (int) ($row->sessions_count ?? 0),
                    'last_activity' => $row->last_activity ? (int) $row->last_activity : null,
                ];
            }
        } catch (\Throwable $e) {
            $sessionAgg = ['sessions_count' => 0, 'last_activity' => null];
        }

        $lastActivityTs = $sessionAgg['last_activity'] ? (int) $sessionAgg['last_activity'] : null;
        $active = $lastActivityTs ? (time() - $lastActivityTs) <= (15 * 60) : false;
        $lastActivityIso = $lastActivityTs ? Carbon::createFromTimestamp($lastActivityTs)->toISOString() : null;

        $messages = HelpdeskMessage::query()
            ->where('user_id', $user->id)
            ->with(['replyTo:id,message,sender,created_at,user_id'])
            ->with(['attachments:id,helpdesk_message_id,kind,original_name,mime,size,path,created_at'])
            ->orderBy('id')
            ->limit(500)
            ->get(['id', 'sender', 'message', 'created_at', 'reply_to_id']);

        $payload = $messages->map(function (HelpdeskMessage $m) {
            $rt = $m->replyTo;

            return [
                'id' => $m->id,
                'sender' => $m->sender,
                'message' => $m->message,
                'created_at' => $m->created_at?->toISOString(),
                'attachments' => $m->attachments->map(fn (HelpdeskAttachment $a) => [
                    'id' => $a->id,
                    'kind' => $a->kind,
                    'original_name' => $a->original_name,
                    'mime' => $a->mime,
                    'size' => $a->size,
                    'url' => Storage::disk('public')->url($a->path),
                ])->values(),
                'reply_to' => $rt ? [
                    'id' => $rt->id,
                    'sender' => $rt->sender,
                    'message' => $rt->message,
                    'created_at' => $rt->created_at?->toISOString(),
                ] : null,
            ];
        })->values();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'active' => $active,
                'last_activity' => $lastActivityIso,
            ],
            'messages' => $payload,
        ]);
    }

    public function reply(Request $request, User $user)
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:2000'],
            'reply_to_id' => ['nullable', 'integer'],
            'files' => ['nullable', 'array'],
            'files.*' => ['file', 'max:20480'],
        ]);

        $replyToId = $validated['reply_to_id'] ?? null;
        if (!empty($replyToId)) {
            $exists = HelpdeskMessage::query()
                ->where('id', $replyToId)
                ->where('user_id', $user->id)
                ->exists();
            if (!$exists) {
                $replyToId = null;
            }
        }

        $m = HelpdeskMessage::query()->create([
            'user_id' => $user->id,
            'sender' => 'admin',
            'message' => $validated['message'],
            'reply_to_id' => $replyToId,
        ]);

        $files = $request->file('files', []);
        if (is_array($files) && count($files)) {
            foreach ($files as $f) {
                if (!$f) continue;
                $mime = (string) ($f->getClientMimeType() ?? '');
                $kind = str_starts_with($mime, 'image/') || str_starts_with($mime, 'video/') ? 'media' : (str_starts_with($mime, 'audio/') ? 'audio' : 'document');
                $path = $f->store('helpdesk', 'public');

                HelpdeskAttachment::query()->create([
                    'helpdesk_message_id' => $m->id,
                    'kind' => $kind,
                    'original_name' => (string) ($f->getClientOriginalName() ?? ''),
                    'mime' => $mime,
                    'size' => (int) ($f->getSize() ?? 0),
                    'path' => $path,
                ]);
            }
        }

        return response()->json([
            'sent' => true,
        ]);
    }
}
