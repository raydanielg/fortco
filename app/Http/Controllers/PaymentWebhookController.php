<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentWebhookController extends Controller
{
    private function verifySecret(Request $request): bool
    {
        $expected = '';
        try {
            $expected = (string) Setting::getValue('payment_webhook_secret', '');
        } catch (\Throwable $e) {
            $expected = '';
        }

        if ($expected === '') {
            return true;
        }

        $provided = (string) ($request->header('X-Webhook-Secret') ?: $request->input('secret', ''));

        return hash_equals($expected, $provided);
    }

    public function pesapal(Request $request)
    {
        if (!$this->verifySecret($request)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        Log::info('Pesapal webhook received', [
            'headers' => $request->headers->all(),
            'payload' => $request->all(),
        ]);

        return response()->json(['received' => true]);
    }

    public function selcom(Request $request)
    {
        if (!$this->verifySecret($request)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        Log::info('Selcom webhook received', [
            'headers' => $request->headers->all(),
            'payload' => $request->all(),
        ]);

        return response()->json(['received' => true]);
    }

    public function zenopay(Request $request)
    {
        if (!$this->verifySecret($request)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        Log::info('Zenopay webhook received', [
            'headers' => $request->headers->all(),
            'payload' => $request->all(),
        ]);

        return response()->json(['received' => true]);
    }
}
