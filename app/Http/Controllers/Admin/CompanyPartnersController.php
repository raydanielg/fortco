<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CompanyPartner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CompanyPartnersController extends Controller
{
    public function data(Request $request)
    {
        $q = (string) $request->query('q', '');

        $partners = CompanyPartner::query()
            ->when($q !== '', fn ($query) => $query->where('name', 'like', "%{$q}%"))
            ->orderBy('name')
            ->limit(500)
            ->get()
            ->map(fn (CompanyPartner $p) => [
                'id' => $p->id,
                'name' => $p->name,
                'has_logo' => (bool) $p->logo_path,
                'logo_url' => $p->logo_path ? Storage::disk('public')->url($p->logo_path) : null,
                'created_at' => optional($p->created_at)->toDateTimeString(),
            ])
            ->values();

        return response()->json([
            'partners' => $partners,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:180'],
            'logo' => ['required', 'image', 'max:4096'],
        ]);

        $path = $request->file('logo')->store('company-partners', 'public');

        CompanyPartner::query()->create([
            'name' => $validated['name'],
            'logo_path' => $path,
        ]);

        return response()->json(['ok' => true], 201);
    }

    public function destroy(Request $request, CompanyPartner $partner)
    {
        if ($partner->logo_path) {
            Storage::disk('public')->delete($partner->logo_path);
        }

        $partner->delete();

        return response()->json(['ok' => true]);
    }
}
