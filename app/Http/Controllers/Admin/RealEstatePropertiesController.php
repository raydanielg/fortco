<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RealEstateProperty;
use App\Models\RealEstatePropertyCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RealEstatePropertiesController extends Controller
{
    public function data(Request $request)
    {
        $q = trim((string) $request->query('q', ''));

        $properties = RealEstateProperty::query()
            ->with('category:id,name')
            ->when($q !== '', function ($query) use ($q) {
                $query->where(function ($inner) use ($q) {
                    $inner
                        ->where('title', 'like', "%{$q}%")
                        ->orWhere('type', 'like', "%{$q}%")
                        ->orWhere('status', 'like', "%{$q}%")
                        ->orWhere('location', 'like', "%{$q}%")
                        ->orWhere('price', 'like', "%{$q}%");
                });
            })
            ->latest('id')
            ->get();

        return response()->json([
            'properties' => $properties,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category_id' => ['nullable', 'integer', 'exists:real_estate_property_categories,id'],
            'type' => ['required', 'string', 'max:50'],
            'status' => ['required', 'string', 'max:50'],
            'location' => ['nullable', 'string', 'max:255'],
            'price' => ['nullable', 'string', 'max:255'],
            'beds' => ['nullable', 'integer', 'min:0'],
            'baths' => ['nullable', 'integer', 'min:0'],
            'size' => ['nullable', 'string', 'max:255'],
            'image' => ['nullable', 'string', 'max:2048'],
            'image_file' => ['nullable', 'file', 'image', 'max:5120'],
            'featured' => ['nullable', 'boolean'],
            'description' => ['nullable', 'string'],
        ]);

        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('real-estate/properties', 'public');
            $data['image'] = Storage::url($path);
        }

        $property = RealEstateProperty::create($data);

        return response()->json([
            'message' => 'Property created',
            'property' => $property->load('category:id,name'),
        ], 201);
    }

    public function destroy(RealEstateProperty $property)
    {
        $property->delete();

        return response()->json([
            'message' => 'Property deleted',
        ]);
    }

    public function categories(Request $request)
    {
        $categories = RealEstatePropertyCategory::query()->latest('id')->get();

        return response()->json([
            'categories' => $categories,
        ]);
    }

    public function storeCategory(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $category = RealEstatePropertyCategory::create($data);

        return response()->json([
            'message' => 'Category created',
            'category' => $category,
        ], 201);
    }

    public function destroyCategory(RealEstatePropertyCategory $category)
    {
        $category->delete();

        return response()->json([
            'message' => 'Category deleted',
        ]);
    }
}
