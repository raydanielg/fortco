<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OfflineRequestPagesController extends Controller
{
    public function pending(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/OfflineRequest/Pending');
    }

    public function approved(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/OfflineRequest/Approved');
    }

    public function rejected(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/OfflineRequest/Rejected');
    }
}
