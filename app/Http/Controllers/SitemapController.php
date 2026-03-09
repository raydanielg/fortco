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
            // Main pages with highest priority - Swahili & English optimized
            ['loc' => $baseUrl, 'lastmod' => $lastModified, 'changefreq' => 'daily', 'priority' => '1.0'],
            ['loc' => url('/about'), 'lastmod' => $lastModified, 'changefreq' => 'weekly', 'priority' => '0.9'],
            ['loc' => url('/services'), 'lastmod' => $lastModified, 'changefreq' => 'weekly', 'priority' => '0.9'],
            ['loc' => url('/projects'), 'lastmod' => $lastModified, 'changefreq' => 'daily', 'priority' => '0.9'],
            ['loc' => url('/contact'), 'lastmod' => $lastModified, 'changefreq' => 'monthly', 'priority' => '0.8'],
            
            // Construction management specific pages
            ['loc' => url('/construction-management'), 'lastmod' => $lastModified, 'changefreq' => 'weekly', 'priority' => '0.8'],
            ['loc' => url('/project-management'), 'lastmod' => $lastModified, 'changefreq' => 'weekly', 'priority' => '0.8'],
            ['loc' => url('/workforce-management'), 'lastmod' => $lastModified, 'changefreq' => 'weekly', 'priority' => '0.7'],
            ['loc' => url('/erp-software'), 'lastmod' => $lastModified, 'changefreq' => 'weekly', 'priority' => '0.7'],
            
            // Swahili optimized URLs
            ['loc' => url('/uongozi-miradi'), 'lastmod' => $lastModified, 'changefreq' => 'weekly', 'priority' => '0.8'],
            ['loc' => url('/huduma-ujenzi'), 'lastmod' => $lastModified, 'changefreq' => 'weekly', 'priority' => '0.8'],
            ['loc' => url('/miradi-ujenzi'), 'lastmod' => $lastModified, 'changefreq' => 'daily', 'priority' => '0.7'],
            ['loc' => url('/usimamizi-wafanyakazi'), 'lastmod' => $lastModified, 'changefreq' => 'weekly', 'priority' => '0.7'],
            
            // Location-based pages for East Africa
            ['loc' => url('/construction-kenya'), 'lastmod' => $lastModified, 'changefreq' => 'weekly', 'priority' => '0.7'],
            ['loc' => url('/construction-tanzania'), 'lastmod' => $lastModified, 'changefreq' => 'weekly', 'priority' => '0.7'],
            ['loc' => url('/construction-uganda'), 'lastmod' => $lastModified, 'changefreq' => 'weekly', 'priority' => '0.7'],
            ['loc' => url('/ujenzi-kenya'), 'lastmod' => $lastModified, 'changefreq' => 'weekly', 'priority' => '0.7'],
            ['loc' => url('/ujenzi-tanzania'), 'lastmod' => $lastModified, 'changefreq' => 'weekly', 'priority' => '0.7'],
            
            // FAQ and support pages
            ['loc' => url('/faq'), 'lastmod' => $lastModified, 'changefreq' => 'monthly', 'priority' => '0.6'],
            ['loc' => url('/maswali-na-majibu'), 'lastmod' => $lastModified, 'changefreq' => 'monthly', 'priority' => '0.6'],
            ['loc' => url('/support'), 'lastmod' => $lastModified, 'changefreq' => 'weekly', 'priority' => '0.6'],
            ['loc' => url('/msaada'), 'lastmod' => $lastModified, 'changefreq' => 'weekly', 'priority' => '0.6'],
            
            // Additional important pages
            ['loc' => url('/gallery'), 'lastmod' => $lastModified, 'changefreq' => 'monthly', 'priority' => '0.5'],
            ['loc' => url('/picha'), 'lastmod' => $lastModified, 'changefreq' => 'monthly', 'priority' => '0.5'],
            ['loc' => url('/testimonials'), 'lastmod' => $lastModified, 'changefreq' => 'monthly', 'priority' => '0.5'],
            ['loc' => url('/ushahidi'), 'lastmod' => $lastModified, 'changefreq' => 'monthly', 'priority' => '0.5'],
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
            if (in_array($url['loc'], [url('/'), url('/about'), url('/services'), url('/projects')])) {
                $xml .= '    <image:image>' . "\n";
                $xml .= '      <image:loc>' . url('/construction-site-architecture-black-woman-with-smartphone-typing-connection-african-person-engineering-inspector-with-cellphone-safety-online-reading-with-digital-app-internet_590464-510750.jpg') . '</image:loc>' . "\n";
                $xml .= '      <image:title>FortCo ERP - Mfumo wa Uongozi wa Miradi ya Ujenzi</image:title>' . "\n";
                $xml .= '      <image:caption>FortCo ERP - Professional Construction Management System for East Africa | Mfumo wa uongozi wa miradi ya ujenzi kwa Afrika Mashariki</image:caption>' . "\n";
                $xml .= '    </image:image>' . "\n";
            }
            
            // Add hreflang for multilingual support
            $xml .= '    <xhtml:link rel="alternate" hreflang="sw" href="' . $url['loc'] . '?lang=sw"/>' . "\n";
            $xml .= '    <xhtml:link rel="alternate" hreflang="en" href="' . $url['loc'] . '?lang=en"/>' . "\n";
            $xml .= '    <xhtml:link rel="alternate" hreflang="x-default" href="' . $url['loc'] . '"/>' . "\n";
            
            $xml .= '  </url>' . "\n";
        }

        $xml .= '</urlset>' . "\n";

        return response($xml, 200)->header('Content-Type', 'text/xml');
    }
}
