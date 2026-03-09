<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Services\SeoService;
use App\Http\Controllers\SeoController;

class SeoMiddleware
{
    protected $seoService;
    protected $seoController;

    public function __construct(SeoService $seoService, SeoController $seoController)
    {
        $this->seoService = $seoService;
        $this->seoController = $seoController;
    }

    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);
        
        // Get current route information
        $route = $request->route();
        $routeName = $route ? $route->getName() : '';
        $path = $request->path();
        
        // Set default SEO based on route
        $this->setRouteSeo($path, $routeName);
        
        return $response;
    }

    private function setRouteSeo($path, $routeName)
    {
        // Add organization schema to all pages
        $this->seoService->addOrganizationSchema();
        
        switch ($path) {
            case '/':
            case 'home':
                $this->seoService->setPageSeo(
                    'FortCo ERP - Mfumo wa Uongozi wa Miradi ya Ujenzi | Construction Management System',
                    'Mfumo mkuu wa uongozi wa miradi ya ujenzi, usimamizi wa wafanyakazi, na huduma za kiufundi. Professional construction ERP system for project management, workforce coordination, and technical services in East Africa.',
                    ['mfumo wa uongozi wa miradi', 'construction management system', 'ERP software', 'ujenzi Kenya'],
                    '/construction-site-architecture-black-woman-with-smartphone-typing-connection-african-person-engineering-inspector-with-cellphone-safety-online-reading-with-digital-app-internet_590464-510750.jpg'
                );
                
                // Add FAQ schema for homepage
                $faqs = $this->seoController->getFaqData();
                $this->seoService->addFaqSchema($faqs);
                
                // Add reviews schema
                $reviewsData = $this->seoController->getReviewsData();
                $this->seoService->addReviewSchema($reviewsData['reviews'], $reviewsData['aggregateRating']);
                break;

            case 'about':
            case 'kuhusu':
                $this->seoService->setPageSeo(
                    'Kuhusu Sisi - FortCo ERP | About Us - Construction Management System',
                    'Jifunze kuhusu FortCo ERP na jinsi tunavyosaidia kampuni za ujenzi kusimamia miradi yao kwa ufanisi. Learn about FortCo ERP and how we help construction companies manage their projects efficiently.',
                    ['kuhusu FortCo', 'about construction ERP', 'company history', 'historia ya kampuni']
                );
                break;

            case 'services':
            case 'huduma':
            case 'huduma-ujenzi':
                $this->seoService->setPageSeo(
                    'Huduma za Ujenzi - FortCo ERP | Construction Services',
                    'Huduma kamili za uongozi wa miradi ya ujenzi, usimamizi wa wafanyakazi, na mfumo wa ERP. Comprehensive construction management services, workforce management, and ERP system.',
                    ['huduma za ujenzi', 'construction services', 'project management services', 'usimamizi wa mradi']
                );
                break;

            case 'projects':
            case 'miradi':
            case 'miradi-ujenzi':
                $this->seoService->setPageSeo(
                    'Miradi ya Ujenzi - FortCo ERP | Construction Projects',
                    'Mifano ya miradi ya ujenzi tuliyokamilisha kwa mafanikio kwa kutumia mfumo wetu wa uongozi. Examples of construction projects we have successfully completed using our management system.',
                    ['miradi ya ujenzi', 'construction projects', 'project examples', 'mifano ya miradi']
                );
                break;

            case 'contact':
            case 'wasiliana':
                $this->seoService->setPageSeo(
                    'Wasiliana Nasi - FortCo ERP | Contact Us',
                    'Wasiliana na timu yetu ya wataalamu wa uongozi wa miradi ya ujenzi. Pata msaada na maelezo zaidi. Contact our team of construction management experts. Get support and more information.',
                    ['wasiliana nasi', 'contact us', 'construction support', 'msaada wa ujenzi']
                );
                break;

            case 'faq':
            case 'maswali-na-majibu':
                $this->seoService->setPageSeo(
                    'Maswali na Majibu - FortCo ERP | FAQ',
                    'Majibu ya haraka kwa maswali yanayoulizwa mara kwa mara kuhusu mfumo wetu wa uongozi wa miradi ya ujenzi. Quick answers to frequently asked questions about our construction management system.',
                    ['maswali na majibu', 'FAQ construction', 'construction questions', 'maswali ya ujenzi']
                );
                
                // Add FAQ schema
                $faqs = $this->seoController->getFaqData();
                $this->seoService->addFaqSchema($faqs);
                break;

            case 'construction-management':
            case 'uongozi-miradi':
                $this->seoService->setPageSeo(
                    'Uongozi wa Miradi ya Ujenzi | Construction Management - FortCo ERP',
                    'Mfumo wa kisasa wa uongozi wa miradi ya ujenzi unaowezesha usimamizi wa kina wa kila hatua ya mradi. Modern construction project management system enabling comprehensive oversight of every project phase.',
                    ['uongozi wa miradi', 'construction management', 'project oversight', 'usimamizi wa mradi']
                );
                break;

            case 'workforce-management':
            case 'usimamizi-wafanyakazi':
                $this->seoService->setPageSeo(
                    'Usimamizi wa Wafanyakazi | Workforce Management - FortCo ERP',
                    'Mfumo wa usimamizi wa wafanyakazi wa ujenzi unaoongoza mahudhurio, mishahara, na utendaji. Construction workforce management system handling attendance, payroll, and performance.',
                    ['usimamizi wa wafanyakazi', 'workforce management', 'employee management', 'uongozi wa wafanyakazi']
                );
                break;

            // Location-based pages
            case 'construction-kenya':
            case 'ujenzi-kenya':
                $this->seoService->setPageSeo(
                    'Huduma za Ujenzi Kenya | Construction Services Kenya - FortCo ERP',
                    'Huduma za uongozi wa miradi ya ujenzi nchini Kenya. Mfumo wa ERP kwa kampuni za ujenzi Kenya. Construction management services in Kenya. ERP system for Kenyan construction companies.',
                    ['ujenzi Kenya', 'construction Kenya', 'Kenya construction management', 'huduma za ujenzi Kenya']
                );
                break;

            case 'construction-tanzania':
            case 'ujenzi-tanzania':
                $this->seoService->setPageSeo(
                    'Huduma za Ujenzi Tanzania | Construction Services Tanzania - FortCo ERP',
                    'Huduma za uongozi wa miradi ya ujenzi nchini Tanzania. Mfumo wa ERP kwa kampuni za ujenzi Tanzania. Construction management services in Tanzania. ERP system for Tanzanian construction companies.',
                    ['ujenzi Tanzania', 'construction Tanzania', 'Tanzania construction management', 'huduma za ujenzi Tanzania']
                );
                break;

            default:
                // Default SEO for unmatched routes
                $this->seoService->setPageSeo(
                    'FortCo ERP - Mfumo wa Uongozi wa Miradi ya Ujenzi',
                    'Mfumo mkuu wa uongozi wa miradi ya ujenzi kwa Afrika Mashariki. Professional construction management system for East Africa.',
                    ['construction management', 'ujenzi', 'ERP system', 'project management']
                );
                break;
        }

        // Add breadcrumbs for all pages
        $breadcrumbs = $this->seoController->getBreadcrumbs($this->getPageType($path));
        $this->seoService->addBreadcrumbSchema($breadcrumbs);

        // Add hreflang tags
        $this->seoService->addHreflangTags(url()->current());
    }

    private function getPageType($path)
    {
        if (str_contains($path, 'service') || str_contains($path, 'huduma')) {
            return 'services';
        } elseif (str_contains($path, 'project') || str_contains($path, 'miradi')) {
            return 'projects';
        } elseif (str_contains($path, 'about') || str_contains($path, 'kuhusu')) {
            return 'about';
        } elseif (str_contains($path, 'contact') || str_contains($path, 'wasiliana')) {
            return 'contact';
        }
        
        return 'home';
    }
}
