<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ConstructionPagesController extends Controller
{
    public function projects(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/Construction/Projects');
    }

    public function createProject(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/Construction/CreateProject');
    }

    public function projectCategories(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/Construction/ProjectCategories');
    }

    public function locations(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/Construction/Locations');
    }

    public function materials(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/Construction/Materials');
    }

    public function workers(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/Construction/Workers');
    }
}
