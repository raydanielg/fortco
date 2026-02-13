<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RealEstatePropertyBooking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RealEstateBookingsController extends Controller
{
    public function show(RealEstatePropertyBooking $booking): Response
    {
        $booking->load('property:id,title,location,price,image,type,status');

        return Inertia::render('Sessions/Dashboard/SuperAdmin/RealEstate/BookingView', [
            'booking' => $booking,
        ]);
    }

    public function invoice(RealEstatePropertyBooking $booking): Response
    {
        $booking->load('property:id,title,location,price,image,type,status');

        return Inertia::render('Sessions/Dashboard/SuperAdmin/RealEstate/BookingInvoice', [
            'booking' => $booking,
        ]);
    }

    public function data(Request $request)
    {
        $q = trim((string) $request->query('q', ''));
        $status = trim((string) $request->query('status', ''));

        $bookings = RealEstatePropertyBooking::query()
            ->with('property:id,title,location,price,image')
            ->when($status !== '', function ($query) use ($status) {
                if ($status === 'completed') {
                    $query->where('status', 'completed');
                    return;
                }

                if ($status === 'ongoing') {
                    $query->where('status', '!=', 'completed');
                }
            })
            ->when($q !== '', function ($query) use ($q) {
                $query->where(function ($inner) use ($q) {
                    $inner
                        ->where('property_title', 'like', "%{$q}%")
                        ->orWhere('full_name', 'like', "%{$q}%")
                        ->orWhere('phone_number', 'like', "%{$q}%")
                        ->orWhere('status', 'like', "%{$q}%");
                });
            })
            ->latest('id')
            ->get();

        return response()->json([
            'bookings' => $bookings,
        ]);
    }

    public function destroy(RealEstatePropertyBooking $booking)
    {
        $booking->delete();

        return response()->json([
            'message' => 'Booking deleted',
        ]);
    }

    public function updateStatus(Request $request, RealEstatePropertyBooking $booking)
    {
        $data = $request->validate([
            'status' => ['required', 'in:ongoing,completed'],
        ]);

        $booking->update([
            'status' => $data['status'],
        ]);

        return response()->json([
            'message' => 'Status updated',
            'booking' => $booking->fresh()->load('property:id,title,location,price,image'),
        ]);
    }
}
