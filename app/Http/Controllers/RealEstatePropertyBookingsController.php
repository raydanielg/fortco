<?php

namespace App\Http\Controllers;

use App\Models\RealEstateProperty;
use App\Models\RealEstatePropertyBooking;
use Illuminate\Http\Request;

class RealEstatePropertyBookingsController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'property_id' => ['nullable', 'integer', 'exists:real_estate_properties,id'],
            'property_title' => ['nullable', 'string', 'max:255'],
            'full_name' => ['required', 'string', 'max:255'],
            'phone_number' => ['required', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
        ]);

        if (!empty($data['property_id']) && empty($data['property_title'])) {
            $property = RealEstateProperty::query()->find($data['property_id']);
            if ($property) {
                $data['property_title'] = $property->title;
            }
        }

        $booking = RealEstatePropertyBooking::create([
            'property_id' => $data['property_id'] ?? null,
            'property_title' => $data['property_title'] ?? null,
            'full_name' => $data['full_name'],
            'phone_number' => $data['phone_number'],
            'email' => $data['email'] ?? null,
            'status' => 'ongoing',
        ]);

        return response()->json([
            'message' => "Successfully received. We'll be back in short in contact.",
            'booking_id' => $booking->id,
        ], 201);
    }
}
