<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dashboard based on user role.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        if ($user->hasRole('Super Admin')) {
            return Inertia::render('Sessions/Dashboard/SuperAdmin/Index', [
                'auth' => [
                    'user' => $user,
                    'roles' => $user->getRoleNames(),
                    'permissions' => $user->getAllPermissions()->pluck('name'),
                ],
            ]);
        }

        // Default fallback for other roles
        return Inertia::render('Dashboard');
    }
}
