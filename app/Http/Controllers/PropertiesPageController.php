<?php

namespace App\Http\Controllers;

use App\Models\RealEstateProperty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class PropertiesPageController extends Controller
{
    public function index(Request $request): Response
    {
        $properties = RealEstateProperty::query()
            ->whereNotNull('title')
            ->latest('id')
            ->take(50)
            ->get([
                'id',
                'title',
                'type',
                'status',
                'location',
                'price',
                'beds',
                'baths',
                'size',
                'image',
                'featured',
                'description',
            ]);

        return Inertia::render('Properties', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'properties' => $properties,
        ]);
    }
}
