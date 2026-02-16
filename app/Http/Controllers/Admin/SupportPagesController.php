<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupportPagesController extends Controller
{
    public function tickets(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/Support/Tickets');
    }

    public function liveChat(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/Support/LiveChat');
    }

    public function knowledgeBase(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/Support/KnowledgeBase');
    }

    public function helpdeskMessages(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/Support/HelpdeskMessages');
    }
}
