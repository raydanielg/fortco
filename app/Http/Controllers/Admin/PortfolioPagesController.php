<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PortfolioPagesController extends Controller
{
    public function gallery(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/Portfolio/Gallery');
    }

    public function testimonials(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/Portfolio/Testimonials');
    }

    public function awards(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/Portfolio/Awards');
    }
}
