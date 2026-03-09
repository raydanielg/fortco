import React from 'react';
import { Head } from '@inertiajs/react';

const SeoHead = ({ 
    title, 
    description, 
    keywords = [], 
    image = null, 
    url = null,
    type = 'website',
    organizationSchema = null,
    faqSchema = null,
    breadcrumbSchema = null,
    reviewSchema = null
}) => {
    const defaultImage = '/construction-site-architecture-black-woman-with-smartphone-typing-connection-african-person-engineering-inspector-with-cellphone-safety-online-reading-with-digital-app-internet_590464-510750.jpg';
    const seoImage = image || defaultImage;
    const currentUrl = url || window.location.href;
    
    // Default keywords
    const defaultKeywords = [
        'mfumo wa uongozi wa miradi', 'ujenzi wa nyumba', 'usimamizi wa mradi', 'huduma za ujenzi',
        'construction management system', 'ERP software', 'project management', 'construction ERP',
        'ujenzi Kenya', 'construction Tanzania', 'ujenzi Uganda', 'construction East Africa'
    ];
    
    const allKeywords = [...defaultKeywords, ...keywords].join(', ');

    return (
        <Head>
            {/* Basic Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={allKeywords} />
            <meta name="author" content="FortCo ERP" />
            <meta name="robots" content="index,follow" />
            <meta name="language" content="sw,en" />
            <meta name="revisit-after" content="7 days" />
            <meta name="distribution" content="global" />
            <meta name="rating" content="general" />
            
            {/* Canonical URL */}
            <link rel="canonical" href={currentUrl} />
            
            {/* Hreflang Tags */}
            <link rel="alternate" hreflang="sw" href={`${currentUrl}?lang=sw`} />
            <link rel="alternate" hreflang="en" href={`${currentUrl}?lang=en`} />
            <link rel="alternate" hreflang="x-default" href={currentUrl} />
            
            {/* Open Graph Tags */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={type} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:site_name" content="FortCo ERP" />
            <meta property="og:image" content={seoImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content="FortCo ERP - Construction Management System" />
            <meta property="og:locale" content="sw_KE" />
            <meta property="og:locale:alternate" content="en_US" />
            
            {/* Twitter Card Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@FortCoERP" />
            <meta name="twitter:creator" content="@FortCoERP" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={seoImage} />
            <meta name="twitter:image:alt" content="FortCo ERP - Construction Management System" />
            
            {/* Additional Meta Tags */}
            <meta name="theme-color" content="#2563eb" />
            <meta name="msapplication-TileColor" content="#2563eb" />
            <meta name="application-name" content="FortCo ERP" />
            <meta name="apple-mobile-web-app-title" content="FortCo ERP" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            
            {/* Geo Tags for East Africa */}
            <meta name="geo.region" content="KE" />
            <meta name="geo.placename" content="East Africa" />
            <meta name="geo.position" content="-1.286389;36.817223" />
            <meta name="ICBM" content="-1.286389, 36.817223" />
            
            {/* Schema.org JSON-LD */}
            {organizationSchema && (
                <script 
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
                />
            )}
            
            {faqSchema && (
                <script 
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}
            
            {breadcrumbSchema && (
                <script 
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
                />
            )}
            
            {reviewSchema && (
                <script 
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
                />
            )}
        </Head>
    );
};

export default SeoHead;
