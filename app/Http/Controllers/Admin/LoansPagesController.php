<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LoansPagesController extends Controller
{
    public function companies(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/Loans/Companies');
    }

    public function applications(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/Loans/Applications');
    }

    public function repayments(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/Loans/Repayments');
    }
}
