<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BillingPagesController extends Controller
{
    public function invoices(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/Billing/Invoices');
    }

    public function transactions(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/Billing/Transactions');
    }

    public function gateways(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/Billing/Gateways');
    }
}
