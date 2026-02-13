<?php

namespace App\Http\Controllers;

use App\Models\PortfolioProject;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PortfolioController extends Controller
{
    public function index(Request $request): Response
    {
        $featured = PortfolioProject::query()
            ->where('type', 'featured')
            ->where('is_published', true)
            ->orderByDesc('sort_order')
            ->orderByDesc('year')
            ->orderByDesc('id')
            ->limit(50)
            ->get()
            ->map(fn (PortfolioProject $p) => [
                'id' => $p->slug,
                'name' => $p->name,
                'location' => $p->location,
                'year' => $p->year ? (string) $p->year : null,
                'category' => $p->category,
                'value' => $p->value,
                'desc' => $p->desc,
                'features' => array_values(array_filter($p->features ?? [])),
                'occupiedBy' => array_values(array_filter($p->occupied_by ?? [])),
                'testimonial' => $p->testimonial,
            ])
            ->values();

        $ongoing = PortfolioProject::query()
            ->where('type', 'ongoing')
            ->where('is_published', true)
            ->orderByDesc('sort_order')
            ->orderByDesc('id')
            ->limit(50)
            ->get()
            ->map(fn (PortfolioProject $p) => [
                'name' => $p->name,
                'location' => $p->location,
                'expected' => $p->expected,
                'category' => $p->category,
                'progress' => $p->progress,
                'desc' => $p->desc,
                'status' => array_values(array_filter($p->status_updates ?? [])),
            ])
            ->values();

        return Inertia::render('Portfolio/Index', [
            'canLogin' => \Route::has('login'),
            'canRegister' => \Route::has('register'),
            'featuredProjects' => $featured,
            'ongoingProjects' => $ongoing,
        ]);
    }
}
