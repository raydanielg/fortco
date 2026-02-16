<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SuperAdminPagesController extends Controller
{
    public function systemAudit(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/SuperAdmin/SystemAudit');
    }

    public function modules(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/SuperAdmin/Modules');
    }

    public function impersonate(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/SuperAdmin/Impersonate');
    }

    public function maintenance(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/SuperAdmin/Maintenance');
    }
}
