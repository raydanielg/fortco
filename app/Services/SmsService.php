<?php

namespace App\Services;

use App\Models\Setting;
use AfricasTalking\SDK\AfricasTalking;
use Twilio\Rest\Client;

class SmsService
{
    public function send(string $to, string $message): bool
    {
        $enabled = Setting::getValue('sms_enabled', '0') === '1';
        if (!$enabled) {
            return false;
        }

        $provider = (string) Setting::getValue('sms_provider', 'africastalking');
        $senderId = (string) Setting::getValue('sms_sender_id', '');
        $apiKey = (string) Setting::getValue('sms_api_key', '');
        $username = (string) Setting::getValue('sms_username', '');

        if ($provider === 'twilio') {
            $sid = $username;
            $token = $apiKey;

            if (!$sid || !$token) {
                return false;
            }

            $client = new Client($sid, $token);

            $from = $senderId ?: null;
            if (!$from) {
                return false;
            }

            $client->messages->create($to, [
                'from' => $from,
                'body' => $message,
            ]);

            return true;
        }

        if (!$username || !$apiKey) {
            return false;
        }

        $at = new AfricasTalking($username, $apiKey);
        $sms = $at->sms();

        $options = [
            'to' => $to,
            'message' => $message,
        ];

        if ($senderId) {
            $options['from'] = $senderId;
        }

        $sms->send($options);

        return true;
    }
}
