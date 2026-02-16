<?php

namespace App\Http\Controllers;

use App\Models\HelpdeskMessage;
use App\Models\HelpdeskAttachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HelpdeskChatController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Helpdesk/Chat');
    }

    public function messages(Request $request)
    {
        $user = $request->user();

        $messages = HelpdeskMessage::query()
            ->where('user_id', $user->id)
            ->with(['replyTo:id,message,sender,created_at'])
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
            'messages' => $payload,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

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
            'sender' => 'user',
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
            'message' => $m,
        ]);
    }
}
