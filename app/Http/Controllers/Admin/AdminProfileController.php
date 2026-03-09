<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminProfileController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Sessions/Dashboard/SuperAdmin/Profile/Index', [
            'user' => [
                'id' => $user?->id,
                'name' => $user?->name,
                'email' => $user?->email,
            ],
            'roles' => $user ? $user->getRoleNames() : [],
            'permissions' => $user ? $user->getAllPermissions()->pluck('name') : [],
        ]);
    }
}
