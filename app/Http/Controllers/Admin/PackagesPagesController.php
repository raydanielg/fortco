<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PackagesPagesController extends Controller
{
    public function subscriptions(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/Packages/Subscriptions');
    }

    public function features(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/Packages/Features');
    }

    public function pricing(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/Packages/Pricing');
    }
}
