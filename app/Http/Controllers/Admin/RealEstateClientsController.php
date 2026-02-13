<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RealEstatePropertyBooking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RealEstateClientsController extends Controller
{
    private function makeClientKey(array $row): string
    {
        $email = trim((string) ($row['email'] ?? ''));
        $phone = trim((string) ($row['phone_number'] ?? ''));
        $name = trim((string) ($row['full_name'] ?? ''));

        if ($email !== '') return 'email:' . strtolower($email);
        if ($phone !== '') return 'phone:' . $phone;
        return 'name:' . strtolower($name);
    }

    private function encodeKey(string $key): string
    {
        return rtrim(strtr(base64_encode($key), '+/', '-_'), '=');
    }

    private function decodeKey(string $encoded): string
    {
        $b64 = strtr($encoded, '-_', '+/');
        $pad = strlen($b64) % 4;
        if ($pad) $b64 .= str_repeat('=', 4 - $pad);
        $decoded = base64_decode($b64, true);
        return $decoded === false ? '' : $decoded;
    }

    public function data(Request $request)
    {
        $q = trim((string) $request->query('q', ''));

        $bookings = RealEstatePropertyBooking::query()
            ->latest('id')
            ->get(['id', 'full_name', 'phone_number', 'email', 'status', 'created_at']);

        $clients = $bookings
            ->map(function ($b) {
                return [
                    'id' => $b->id,
                    'full_name' => $b->full_name,
                    'phone_number' => $b->phone_number,
                    'email' => $b->email,
                    'status' => $b->status,
                    'created_at' => $b->created_at,
                ];
            })
            ->groupBy(function ($row) {
                return $this->makeClientKey($row);
            })
            ->map(function ($rows, $key) {
                $first = $rows->first();
                $last = $rows->sortByDesc('created_at')->first();

                return [
                    'client_key' => $this->encodeKey($key),
                    'full_name' => $first['full_name'] ?? null,
                    'phone_number' => $first['phone_number'] ?? null,
                    'email' => $first['email'] ?? null,
                    'bookings_count' => $rows->count(),
                    'last_booking_at' => $last['created_at'] ?? null,
                ];
            })
            ->values();

        if ($q !== '') {
            $qq = strtolower($q);
            $clients = $clients->filter(function ($c) use ($qq) {
                return str_contains(strtolower((string) ($c['full_name'] ?? '')), $qq)
                    || str_contains(strtolower((string) ($c['email'] ?? '')), $qq)
                    || str_contains(strtolower((string) ($c['phone_number'] ?? '')), $qq);
            })->values();
        }

        return response()->json([
            'clients' => $clients,
        ]);
    }

    public function show(string $client, Request $request): Response
    {
        $decoded = $this->decodeKey($client);
        [$type, $value] = array_pad(explode(':', $decoded, 2), 2, '');

        $query = RealEstatePropertyBooking::query()->with('property:id,title,location,price,image');

        if ($type === 'email' && $value !== '') {
            $query->whereRaw('LOWER(email) = ?', [strtolower($value)]);
        } elseif ($type === 'phone' && $value !== '') {
            $query->where('phone_number', $value);
        } elseif ($type === 'name' && $value !== '') {
            $query->whereRaw('LOWER(full_name) = ?', [strtolower($value)]);
        } else {
            $query->whereRaw('1 = 0');
        }

        $bookings = $query->latest('id')->get();
        $first = $bookings->first();

        return Inertia::render('Sessions/Dashboard/SuperAdmin/RealEstate/ClientView', [
            'client' => [
                'client_key' => $client,
                'full_name' => $first?->full_name,
                'phone_number' => $first?->phone_number,
                'email' => $first?->email,
                'bookings_count' => $bookings->count(),
            ],
            'bookings' => $bookings,
        ]);
    }
}
