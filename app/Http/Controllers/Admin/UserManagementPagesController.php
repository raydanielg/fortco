<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserManagementPagesController extends Controller
{
    public function users(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/UserManagement/Users');
    }

    public function employees(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/UserManagement/Employees');
    }

    public function roles(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/UserManagement/Roles');
    }

    public function permissions(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/UserManagement/Permissions');
    }

    public function sessionsLogs(Request $request): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/UserManagement/SessionsLogs');
    }
}
