<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TasksPagesController extends Controller
{
    public function employee(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/Tasks/Employee');
    }

    public function assessment(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/Tasks/Assessment');
    }

    public function evaluation(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/Tasks/Evaluation');
    }

    public function task(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/Tasks/Task');
    }

    public function planning(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/Tasks/Planning');
    }
}
