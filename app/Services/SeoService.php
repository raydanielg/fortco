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
        JsonLd::setType('Organization');
        JsonLd::addValue('name', 'Fortco Company Limited');
        JsonLd::addValue('alternateName', 'Fortco Construction Company');
        JsonLd::addValue('description', 'Fortco Company Limited ni kampuni kuu ya ujenzi inayotoa huduma za ujenzi wa majengo, barabara, na miundombinu Afrika Mashariki. Tunatoa huduma za ubora wa hali ya juu kwa miradi yote ya ujenzi. Leading construction company providing building, road, and infrastructure construction services across East Africa.');
        JsonLd::addValue('url', url('/'));
        JsonLd::addValue('logo', url('/construction-site-architecture-black-woman-with-smartphone-typing-connection-african-person-engineering-inspector-with-cellphone-safety-online-reading-with-digital-app-internet_590464-510750.jpg'));
        JsonLd::addValue('foundingDate', '2020');
        JsonLd::addValue('numberOfEmployees', '100-500');
        
        JsonLd::addValue('address', [
            '@type' => 'PostalAddress',
            'streetAddress' => 'Dar es Salaam Business District',
            'addressLocality' => 'Dar es Salaam',
            'addressRegion' => 'Dar es Salaam',
            'addressCountry' => 'Tanzania',
            'postalCode' => '12345'
        ]);
        
        JsonLd::addValue('contactPoint', [
            '@type' => 'ContactPoint',
            'telephone' => '+255-XXX-XXXX',
            'contactType' => 'customer service',
            'availableLanguage' => ['Swahili', 'English'],
            'areaServed' => 'East Africa'
        ]);
        
        JsonLd::addValue('sameAs', [
            'https://www.facebook.com/fortcocompany',
            'https://www.twitter.com/fortcocompany',
            'https://www.linkedin.com/company/fortco-company-limited',
            'https://www.instagram.com/fortcocompany'
        ]);
        
        JsonLd::addValue('areaServed', [
            'Tanzania', 'Kenya', 'Uganda', 'Rwanda', 'Burundi', 'East Africa'
        ]);
        
        JsonLd::addValue('serviceType', [
            'Building Construction',
            'Road Construction',
            'Bridge Construction',
            'Infrastructure Development',
            'Residential Construction',
            'Commercial Construction',
            'Industrial Construction',
            'Civil Engineering',
            'Project Management',
            'Construction Supervision'
        ]);
        
        JsonLd::addValue('knowsAbout', [
            'Building Construction',
            'Road Construction',
            'Infrastructure Development',
            'Civil Engineering',
            'Project Management',
            'Construction Materials',
            'Quality Control',
            'Safety Management',
            'Construction Planning',
            'Structural Engineering'
        ]);
    }
    
    /**
     * Add FAQ Schema
     */
    public function addFaqSchema($faqs)
    {
        $mainEntity = [];
        foreach ($faqs as $faq) {
            $mainEntity[] = [
                '@type' => 'Question',
                'name' => $faq['question'],
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text' => $faq['answer']
                ]
            ];
        }
        
        JsonLd::setType('FAQPage');
        JsonLd::addValue('mainEntity', $mainEntity);
    }
    
    /**
     * Add Review Schema
     */
    public function addReviewSchema($reviews, $aggregateRating = null)
    {
        JsonLd::setType('Organization');
        
        if ($aggregateRating) {
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
        $itemListElement = [];
        foreach ($breadcrumbs as $index => $breadcrumb) {
            $itemListElement[] = [
                '@type' => 'ListItem',
                'position' => $index + 1,
                'name' => $breadcrumb['name'],
                'item' => $breadcrumb['url']
            ];
        }
        
        JsonLd::setType('BreadcrumbList');
        JsonLd::addValue('itemListElement', $itemListElement);
    }
    
    /**
     * Add Service Schema
     */
    public function addServiceSchema($service)
    {
        JsonLd::setType('Service');
        JsonLd::addValue('name', $service['name']);
        JsonLd::addValue('description', $service['description']);
        JsonLd::addValue('provider', [
            '@type' => 'Organization',
            'name' => 'Fortco Company Limited'
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
     * Get default keywords for construction company
     */
    private function getDefaultKeywords()
    {
        return [
            // Core Swahili terms
            'kampuni ya ujenzi', 'ujenzi', 'miradi ya ujenzi', 'huduma za ujenzi',
            'wafanyakazi wa ujenzi', 'vifaa vya ujenzi', 'ujenzi wa majengo', 'ujenzi wa barabara',
            'makontrakta wa ujenzi', 'injinia wa ujenzi', 'uongozi wa miradi', 'usimamizi wa ujenzi',
            
            // Core English terms
            'construction company', 'building construction', 'construction services', 'construction contractor',
            'construction projects', 'infrastructure construction', 'civil engineering', 'building contractor',
            'construction management', 'project management', 'construction planning', 'quality construction',
            
            // Location terms
            'Tanzania', 'Kenya', 'Uganda', 'East Africa', 'Dar es Salaam', 'Nairobi', 'Kampala'
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
                'anchor' => 'Kampuni ya Ujenzi | Leading Construction Company',
                'title' => 'Fortco Company Limited - Nyumbani'
            ],
            'services' => [
                'url' => '/services',
                'anchor' => 'Huduma za Ujenzi | Construction Services',
                'title' => 'Huduma zetu za ujenzi wa majengo na miundombinu'
            ],
            'projects' => [
                'url' => '/projects',
                'anchor' => 'Miradi ya Ujenzi | Construction Projects',
                'title' => 'Miradi yetu ya ujenzi na mafanikio'
            ],
            'about' => [
                'url' => '/about',
                'anchor' => 'Kuhusu Sisi | About Us',
                'title' => 'Kuhusu Fortco Company Limited na huduma zetu'
            ],
            'contact' => [
                'url' => '/contact',
                'anchor' => 'Wasiliana Nasi | Contact Us',
                'title' => 'Wasiliana na timu yetu ya wataalamu wa ujenzi'
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
