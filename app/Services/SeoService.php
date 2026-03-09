<?php

namespace App\Services;

use Artesaos\SEOTools\Facades\JsonLd;
use Artesaos\SEOTools\Facades\SEOMeta;
use Artesaos\SEOTools\Facades\OpenGraph;
use Artesaos\SEOTools\Facades\TwitterCard;

class SeoService
{
    /**
     * Set page SEO with Swahili and English optimization
     */
    public function setPageSeo($title, $description, $keywords = [], $image = null, $type = 'website')
    {
        // Set meta tags
        SEOMeta::setTitle($title);
        SEOMeta::setDescription($description);
        SEOMeta::setKeywords(array_merge($keywords, $this->getDefaultKeywords()));
        SEOMeta::setCanonical(url()->current());
        SEOMeta::addMeta('robots', 'index,follow');
        SEOMeta::addMeta('author', 'FortCo ERP');
        SEOMeta::addMeta('language', 'sw,en');
        
        // Set Open Graph
        OpenGraph::setTitle($title);
        OpenGraph::setDescription($description);
        OpenGraph::setUrl(url()->current());
        OpenGraph::setType($type);
        OpenGraph::setSiteName('FortCo ERP');
        
        if ($image) {
            OpenGraph::addImage($image);
        }
        
        // Set Twitter Card
        TwitterCard::setTitle($title);
        TwitterCard::setDescription($description);
        TwitterCard::setType('summary_large_image');
        TwitterCard::setSite('@FortCoERP');
        
        if ($image) {
            TwitterCard::setImage($image);
        }
    }
    
    /**
     * Add Organization Schema
     */
    public function addOrganizationSchema()
    {
        JsonLd::addValue('@context', 'https://schema.org');
        JsonLd::addValue('@type', 'Organization');
        JsonLd::addValue('name', 'FortCo ERP');
        JsonLd::addValue('alternateName', 'FortCo Construction Management System');
        JsonLd::addValue('description', 'Mfumo mkuu wa uongozi wa miradi ya ujenzi, usimamizi wa wafanyakazi, na huduma za kiufundi. Professional construction ERP system for project management in East Africa.');
        JsonLd::addValue('url', url('/'));
        JsonLd::addValue('logo', url('/construction-site-architecture-black-woman-with-smartphone-typing-connection-african-person-engineering-inspector-with-cellphone-safety-online-reading-with-digital-app-internet_590464-510750.jpg'));
        
        JsonLd::addValue('address', [
            '@type' => 'PostalAddress',
            'addressLocality' => 'Nairobi',
            'addressCountry' => 'Kenya',
            'addressRegion' => 'East Africa'
        ]);
        
        JsonLd::addValue('contactPoint', [
            '@type' => 'ContactPoint',
            'telephone' => '+254-XXX-XXXX',
            'contactType' => 'customer service',
            'availableLanguage' => ['Swahili', 'English']
        ]);
        
        JsonLd::addValue('sameAs', [
            'https://www.facebook.com/fortcoerp',
            'https://www.twitter.com/fortcoerp',
            'https://www.linkedin.com/company/fortcoerp'
        ]);
        
        JsonLd::addValue('areaServed', [
            'Kenya', 'Tanzania', 'Uganda', 'Rwanda', 'East Africa'
        ]);
        
        JsonLd::addValue('serviceType', [
            'Construction Management',
            'Project Management',
            'ERP Software',
            'Workforce Management',
            'Technical Services'
        ]);
    }
    
    /**
     * Add FAQ Schema
     */
    public function addFaqSchema($faqs)
    {
        $faqData = [
            '@context' => 'https://schema.org',
            '@type' => 'FAQPage',
            'mainEntity' => []
        ];
        
        foreach ($faqs as $faq) {
            $faqData['mainEntity'][] = [
                '@type' => 'Question',
                'name' => $faq['question'],
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text' => $faq['answer']
                ]
            ];
        }
        
        JsonLd::addValue($faqData);
    }
    
    /**
     * Add Review Schema
     */
    public function addReviewSchema($reviews, $aggregateRating = null)
    {
        if ($aggregateRating) {
            JsonLd::addValue('@context', 'https://schema.org');
            JsonLd::addValue('@type', 'Organization');
            JsonLd::addValue('aggregateRating', [
                '@type' => 'AggregateRating',
                'ratingValue' => $aggregateRating['rating'],
                'reviewCount' => $aggregateRating['count'],
                'bestRating' => '5',
                'worstRating' => '1'
            ]);
        }
        
        $reviewsData = [];
        foreach ($reviews as $review) {
            $reviewsData[] = [
                '@type' => 'Review',
                'author' => [
                    '@type' => 'Person',
                    'name' => $review['author']
                ],
                'reviewRating' => [
                    '@type' => 'Rating',
                    'ratingValue' => $review['rating'],
                    'bestRating' => '5',
                    'worstRating' => '1'
                ],
                'reviewBody' => $review['body'],
                'datePublished' => $review['date']
            ];
        }
        
        if (!empty($reviewsData)) {
            JsonLd::addValue('review', $reviewsData);
        }
    }
    
    /**
     * Add Breadcrumb Schema
     */
    public function addBreadcrumbSchema($breadcrumbs)
    {
        $breadcrumbData = [
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => []
        ];
        
        foreach ($breadcrumbs as $index => $breadcrumb) {
            $breadcrumbData['itemListElement'][] = [
                '@type' => 'ListItem',
                'position' => $index + 1,
                'name' => $breadcrumb['name'],
                'item' => $breadcrumb['url']
            ];
        }
        
        JsonLd::addValue($breadcrumbData);
    }
    
    /**
     * Add Service Schema
     */
    public function addServiceSchema($service)
    {
        JsonLd::addValue('@context', 'https://schema.org');
        JsonLd::addValue('@type', 'Service');
        JsonLd::addValue('name', $service['name']);
        JsonLd::addValue('description', $service['description']);
        JsonLd::addValue('provider', [
            '@type' => 'Organization',
            'name' => 'FortCo ERP'
        ]);
        JsonLd::addValue('areaServed', 'East Africa');
        JsonLd::addValue('serviceType', $service['type']);
        
        if (isset($service['offers'])) {
            JsonLd::addValue('offers', [
                '@type' => 'Offer',
                'price' => $service['offers']['price'],
                'priceCurrency' => $service['offers']['currency'],
                'availability' => 'https://schema.org/InStock'
            ]);
        }
    }
    
    /**
     * Get default keywords for construction/ERP domain
     */
    private function getDefaultKeywords()
    {
        return [
            // Core Swahili terms
            'mfumo wa uongozi', 'ujenzi', 'miradi', 'usimamizi', 'huduma za ujenzi',
            'wafanyakazi', 'vifaa vya ujenzi', 'uongozi wa kampuni', 'teknolojia ya ujenzi',
            
            // Core English terms
            'construction management', 'ERP system', 'project management', 'workforce management',
            'construction technology', 'building management', 'construction services',
            
            // Location terms
            'Kenya', 'Tanzania', 'Uganda', 'East Africa', 'Nairobi', 'Dar es Salaam'
        ];
    }
    
    /**
     * Generate internal linking suggestions
     */
    public function getInternalLinks($currentPage)
    {
        $links = [
            'home' => [
                'url' => '/',
                'anchor' => 'Mfumo wa Uongozi wa Miradi | Construction Management System',
                'title' => 'FortCo ERP - Nyumbani'
            ],
            'services' => [
                'url' => '/services',
                'anchor' => 'Huduma za Ujenzi | Construction Services',
                'title' => 'Huduma zetu za ujenzi na usimamizi wa miradi'
            ],
            'projects' => [
                'url' => '/projects',
                'anchor' => 'Miradi ya Ujenzi | Construction Projects',
                'title' => 'Miradi yetu ya ujenzi na mafanikio'
            ],
            'about' => [
                'url' => '/about',
                'anchor' => 'Kuhusu Sisi | About Us',
                'title' => 'Kuhusu FortCo ERP na huduma zetu'
            ],
            'contact' => [
                'url' => '/contact',
                'anchor' => 'Wasiliana Nasi | Contact Us',
                'title' => 'Wasiliana na timu yetu ya wataalamu'
            ]
        ];
        
        // Remove current page from suggestions
        unset($links[$currentPage]);
        
        return $links;
    }
    
    /**
     * Generate hreflang tags for multilingual support
     */
    public function addHreflangTags($currentUrl)
    {
        SEOMeta::addMeta('link', '<link rel="alternate" hreflang="sw" href="' . $currentUrl . '?lang=sw" />');
        SEOMeta::addMeta('link', '<link rel="alternate" hreflang="en" href="' . $currentUrl . '?lang=en" />');
        SEOMeta::addMeta('link', '<link rel="alternate" hreflang="x-default" href="' . $currentUrl . '" />');
    }
}
