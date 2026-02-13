<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CompanyVendor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CompanyVendorsController extends Controller
{
    public function data(Request $request)
    {
        $q = (string) $request->query('q', '');
        $status = (string) $request->query('status', '');

        $vendors = CompanyVendor::query()
            ->when($status !== '', fn ($query) => $query->where('verification_status', '=', $status))
            ->when($q !== '', function ($query) use ($q) {
                $query->where('company_name', 'like', "%{$q}%")
                    ->orWhere('tin_number', 'like', "%{$q}%");
            })
            ->orderByDesc('id')
            ->limit(500)
            ->get()
            ->map(fn (CompanyVendor $v) => [
                'id' => $v->id,
                'company_name' => $v->company_name,
                'tin_number' => $v->tin_number,
                'verification_status' => $v->verification_status,
                'has_document' => (bool) $v->verification_document_path,
                'created_at' => optional($v->created_at)->toDateTimeString(),
            ])
            ->values();

        return response()->json([
            'vendors' => $vendors,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_name' => ['required', 'string', 'max:180'],
            'tin_number' => ['required', 'string', 'max:60', 'unique:company_vendors,tin_number'],
            'verification_document' => ['required', 'file', 'mimes:pdf', 'max:8192'],
        ]);

        $path = $request->file('verification_document')->store('company-vendors', 'public');

        CompanyVendor::query()->create([
            'company_name' => $validated['company_name'],
            'tin_number' => $validated['tin_number'],
            'verification_document_path' => $path,
            'verification_status' => 'pending',
        ]);

        return response()->json([
            'ok' => true,
        ], 201);
    }

    public function destroy(Request $request, CompanyVendor $vendor)
    {
        if ($vendor->verification_document_path) {
            Storage::disk('public')->delete($vendor->verification_document_path);
        }

        $vendor->delete();

        return response()->json(['ok' => true]);
    }

    public function download(Request $request, CompanyVendor $vendor)
    {
        if (!$vendor->verification_document_path) {
            abort(404);
        }

        return Storage::disk('public')->download($vendor->verification_document_path);
    }

    public function preview(Request $request, CompanyVendor $vendor)
    {
        if (!$vendor->verification_document_path) {
            abort(404);
        }

        $filename = 'vendor-verification-' . $vendor->id . '.pdf';

        return Storage::disk('public')->response(
            $vendor->verification_document_path,
            $filename,
            [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="' . $filename . '"',
            ]
        );
    }

    public function updateStatus(Request $request, CompanyVendor $vendor)
    {
        $validated = $request->validate([
            'verification_status' => ['required', 'string', 'max:30'],
        ]);

        $vendor->update([
            'verification_status' => $validated['verification_status'],
        ]);

        return response()->json(['ok' => true]);
    }
}
