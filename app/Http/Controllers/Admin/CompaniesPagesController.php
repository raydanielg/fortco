<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CompaniesPagesController extends Controller
{
    public function profile(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/Companies/Profile');
    }

    public function partners(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/Companies/Partners');
    }

    public function vendors(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/Companies/Vendors');
    }
}
