<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CompanyCompany;
use Illuminate\Http\Request;

class CompanyCompaniesController extends Controller
{
    public function data(Request $request)
    {
        $q = (string) $request->query('q', '');

        $companies = CompanyCompany::query()
            ->where('verification_status', '=', 'verified')
            ->when($q !== '', function ($query) use ($q) {
                $query->where('full_name', 'like', "%{$q}%")
                    ->orWhere('tin_number', 'like', "%{$q}%");
            })
            ->orderBy('full_name')
            ->limit(500)
            ->get()
            ->map(fn (CompanyCompany $c) => [
                'id' => $c->id,
                'full_name' => $c->full_name,
                'tin_number' => $c->tin_number,
                'verification_status' => $c->verification_status,
                'created_at' => optional($c->created_at)->toDateTimeString(),
            ])
            ->values();

        return response()->json([
            'companies' => $companies,
        ]);
    }
}
