<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportsPagesController extends Controller
{
    public function financial(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/Reports/Financial');
    }

    public function projects(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/Reports/Projects');
    }

    public function export(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/Reports/Export');
    }
}
