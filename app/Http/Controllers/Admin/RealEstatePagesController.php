<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RealEstatePagesController extends Controller
{
    public function properties(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/RealEstate/Properties');
    }

    public function bookings(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/RealEstate/Bookings');
    }

    public function clients(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/RealEstate/Clients');
    }
}
