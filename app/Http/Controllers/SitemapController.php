<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;
use Illuminate\Support\Facades\Route;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $baseUrl = url('/');
        $lastModified = now()->toAtomString();
        
        $urls = [
            // Main pages with highest priority
            ['loc' => $baseUrl, 'lastmod' => $lastModified, 'changefreq' => 'daily', 'priority' => '1.0'],
            ['loc' => url('/about'), 'lastmod' => $lastModified, 'changefreq' => 'weekly', 'priority' => '0.9'],
            ['loc' => url('/services'), 'lastmod' => $lastModified, 'changefreq' => 'weekly', 'priority' => '0.9'],
            ['loc' => url('/properties'), 'lastmod' => $lastModified, 'changefreq' => 'daily', 'priority' => '0.9'],
            ['loc' => url('/portfolio'), 'lastmod' => $lastModified, 'changefreq' => 'weekly', 'priority' => '0.8'],
            
            // Additional important pages
            ['loc' => url('/gallery'), 'lastmod' => $lastModified, 'changefreq' => 'monthly', 'priority' => '0.7'],
        ];

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"' . "\n";
        $xml .= '        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"' . "\n";
        $xml .= '        xmlns:xhtml="http://www.w3.org/1999/xhtml"' . "\n";
        $xml .= '        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"' . "\n";
        $xml .= '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"' . "\n";
        $xml .= '        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">' . "\n";

        foreach ($urls as $url) {
            $xml .= '  <url>' . "\n";
            $xml .= '    <loc>' . htmlspecialchars($url['loc']) . '</loc>' . "\n";
            $xml .= '    <lastmod>' . $url['lastmod'] . '</lastmod>' . "\n";
            $xml .= '    <changefreq>' . $url['changefreq'] . '</changefreq>' . "\n";
            $xml .= '    <priority>' . $url['priority'] . '</priority>' . "\n";
            
            // Add mobile-friendly tag for all pages
            $xml .= '    <mobile:mobile/>' . "\n";
            
            // Add image sitemap for pages with images
            if (in_array($url['loc'], [url('/'), url('/about'), url('/services'), url('/portfolio')])) {
                $xml .= '    <image:image>' . "\n";
                $xml .= '      <image:loc>' . url('/logo_new.png') . '</image:loc>' . "\n";
                $xml .= '      <image:title>Fortco Company Limited Logo</image:title>' . "\n";
                $xml .= '      <image:caption>Fortco Company Limited - Leading Construction and Real Estate Company in Tanzania</image:caption>' . "\n";
                $xml .= '    </image:image>' . "\n";
            }
            
            $xml .= '  </url>' . "\n";
        }

        $xml .= '</urlset>' . "\n";

        return response($xml, 200)->header('Content-Type', 'text/xml');
    }
}
