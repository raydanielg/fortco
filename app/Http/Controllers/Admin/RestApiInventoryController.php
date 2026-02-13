<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

class RestApiInventoryController extends Controller
{
    public function index(Request $request)
    {
        $items = [];

        foreach (Route::getRoutes() as $route) {
            $uri = (string) $route->uri();
            $name = (string) ($route->getName() ?? '');

            $isApi = str_starts_with($uri, 'api/') || $uri === 'api' || str_starts_with($name, 'api.');
            if (!$isApi) {
                continue;
            }

            $action = $route->getActionName();
            $methods = array_values(array_filter($route->methods(), fn ($m) => !in_array($m, ['HEAD'], true)));
            $middleware = method_exists($route, 'gatherMiddleware') ? $route->gatherMiddleware() : [];

            $module = null;
            if (is_string($action) && str_contains($action, 'Modules\\')) {
                if (preg_match('/Modules\\\\([^\\\\]+)\\\\/', $action, $m)) {
                    $module = $m[1] ?? null;
                }
            }

            $descBase = $name !== '' ? $name : $uri;
            $descBase = str_replace(['api.', '-', '_'], [' ', ' ', ' '], $descBase);
            $descBase = preg_replace('/\s+/', ' ', trim((string) $descBase));
            $description = $descBase !== '' ? ucfirst($descBase) : 'API endpoint';

            $items[] = [
                'methods' => $methods,
                'uri' => '/'.$uri,
                'name' => $name !== '' ? $name : null,
                'action' => is_string($action) ? $action : null,
                'module' => $module,
                'middleware' => array_values($middleware),
                'description' => $description,
            ];
        }

        usort($items, function ($a, $b) {
            $am = (string) ($a['module'] ?? '');
            $bm = (string) ($b['module'] ?? '');
            if ($am !== $bm) return $am <=> $bm;
            return (string) $a['uri'] <=> (string) $b['uri'];
        });

        return response()->json([
            'count' => count($items),
            'routes' => $items,
        ]);
    }
}
