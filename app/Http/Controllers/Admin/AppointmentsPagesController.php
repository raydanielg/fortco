<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AppointmentsPagesController extends Controller
{
    public function calendar(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/Appointments/Calendar');
    }

    public function bookings(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/Appointments/Bookings');
    }

    public function services(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/Appointments/Services');
    }
}
