<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FrontSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class FrontSettingsController extends Controller
{
    public function index(Request $request, string $section = 'header'): Response
    {
        return Inertia::render('Sessions/Dashboard/SuperAdmin/FrontSettings/Index', [
            'section' => $section,
        ]);
    }

    public function data(Request $request)
    {
        $validated = $request->validate([
            'section' => ['required', 'string', 'max:50'],
        ]);

        $rows = FrontSetting::query()
            ->where('section', $validated['section'])
            ->get(['key', 'value']);

        $settings = [];
        foreach ($rows as $row) {
            $settings[$row->key] = $row->value;
        }

        return response()->json([
            'section' => $validated['section'],
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'section' => ['required', 'string', 'max:50'],
            'settings' => ['required', 'array'],
        ]);

        $userId = Auth::id();

        foreach ($validated['settings'] as $key => $value) {
            FrontSetting::query()->updateOrCreate(
                ['section' => $validated['section'], 'key' => (string) $key],
                ['value' => $value, 'updated_by' => $userId]
            );
        }

        return response()->json(['saved' => true]);
    }

    public function upload(Request $request)
    {
        $validated = $request->validate([
            'section' => ['required', 'string', 'max:50'],
            'key' => ['required', 'string', 'max:100'],
            'file' => ['required', 'file', 'max:5120'],
        ]);

        $path = $request->file('file')->store('front-settings', 'public');
        $url = '/storage/' . $path;

        FrontSetting::query()->updateOrCreate(
            ['section' => $validated['section'], 'key' => $validated['key']],
            ['value' => $url, 'updated_by' => Auth::id()]
        );

        return response()->json([
            'uploaded' => true,
            'url' => $url,
        ]);
    }
}
