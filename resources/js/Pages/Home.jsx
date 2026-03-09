import { Head } from '@inertiajs/react';

import Blogs from './Home/sections/Blogs';
import AboutUs from './Home/sections/AboutUs';
import ContactUs from './Home/sections/ContactUs';
import Companies from './Home/sections/Companies';
import Features from './Home/sections/Features';
import Footer from './Home/sections/Footer';
import Header from './Home/sections/Header';
import Hero from './Home/sections/Hero';
import Services from './Home/sections/Services';
import Testimonials from './Home/sections/Testimonials';
import WhyChooseUs from './Home/sections/WhyChooseUs';

export default function Home({ canLogin, canRegister }) {
    const seoTitle = "Fortco Company Limited | Leading Real Estate & Construction Management in Tanzania";
    const seoDescription = "Fortco Company Limited is Tanzania's premier construction and real estate management company based in Mwanza. We provide comprehensive property management, construction tracking, and loan processing services across Tanzania with modern technology and expert delivery.";
    const seoKeywords = "Fortco Company Limited, Real Estate Tanzania, Construction Management Tanzania, Property Management Mwanza, Construction Company Tanzania, Real Estate Mwanza, Building Construction Tanzania, Property Development, Construction Tracking, Loan Processing Tanzania";
    const siteUrl = window.location.origin;
    const ogImage = `${siteUrl}/logo_new.png`;
    const currentUrl = `${siteUrl}${window.location.pathname}`;
    
    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": `${siteUrl}/#organization`,
                "name": "Fortco Company Limited",
                "alternateName": "Fortco",
                "url": siteUrl,
                "logo": {
                    "@type": "ImageObject",
                    "@id": `${siteUrl}/#logo`,
                    "url": ogImage,
                    "contentUrl": ogImage,
                    "width": 512,
                    "height": 512,
                    "caption": "Fortco Company Limited Logo"
                },
                "image": {
                    "@id": `${siteUrl}/#logo`
                },
                "description": seoDescription,
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Mwanza",
                    "addressCountry": "Tanzania"
                },
                "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+255746423472",
                    "email": "info@fortco.co.tz",
                    "contactType": "customer service"
                },
                "sameAs": [
                    `${siteUrl}/about`,
                    `${siteUrl}/services`,
                    `${siteUrl}/portfolio`
                ]
            },
            {
                "@type": "WebSite",
                "@id": `${siteUrl}/#website`,
                "url": siteUrl,
                "name": "Fortco Company Limited",
                "description": seoDescription,
                "publisher": {
                    "@id": `${siteUrl}/#organization`
                },
                "potentialAction": [
                    {
                        "@type": "SearchAction",
                        "target": {
                            "@type": "EntryPoint",
                            "urlTemplate": `${siteUrl}/properties?search={search_term_string}`
                        },
                        "query-input": "required name=search_term_string"
                    }
                ],
                "inLanguage": "en-US"
            },
            {
                "@type": "WebPage",
                "@id": `${currentUrl}/#webpage`,
                "url": currentUrl,
                "name": seoTitle,
                "isPartOf": {
                    "@id": `${siteUrl}/#website`
                },
                "about": {
                    "@id": `${siteUrl}/#organization`
                },
                "description": seoDescription,
                "breadcrumb": {
                    "@id": `${currentUrl}/#breadcrumb`
                },
                "inLanguage": "en-US",
                "potentialAction": [
                    {
                        "@type": "ReadAction",
                        "target": [currentUrl]
                    }
                ]
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${currentUrl}/#breadcrumb`,
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": siteUrl
                    }
                ]
            }
        ]
    };

    return (
        <>
            <Head>
                <title>{seoTitle}</title>
                <meta name="description" content={seoDescription} />
                <meta name="keywords" content={seoKeywords} />
                <meta name="author" content="Fortco Company Limited" />
                <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
                <link rel="canonical" href={currentUrl} />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content={currentUrl} />
                <meta property="og:title" content={seoTitle} />
                <meta property="og:description" content={seoDescription} />
                <meta property="og:image" content={ogImage} />
                <meta property="og:image:width" content="512" />
                <meta property="og:image:height" content="512" />
                <meta property="og:image:alt" content="Fortco Company Limited Logo" />
                <meta property="og:site_name" content="Fortco Company Limited" />
                <meta property="og:locale" content="en_US" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={currentUrl} />
                <meta name="twitter:title" content={seoTitle} />
                <meta name="twitter:description" content={seoDescription} />
                <meta name="twitter:image" content={ogImage} />
                <meta name="twitter:image:alt" content="Fortco Company Limited Logo" />
                <meta name="twitter:site" content="@FortcoTZ" />
                <meta name="twitter:creator" content="@FortcoTZ" />
                
                {/* Additional SEO Meta Tags */}
                <meta name="geo.region" content="TZ-26" />
                <meta name="geo.placename" content="Mwanza, Tanzania" />
                <meta name="geo.position" content="-2.5164;32.9175" />
                <meta name="ICBM" content="-2.5164, 32.9175" />
                
                {/* Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            </Head>
            <div className="min-h-screen bg-white text-slate-900">
                <Header canLogin={canLogin} canRegister={canRegister} />
                <main>
                    <Hero />
                    <Companies />
                    <Features />
                    <Services />
                    <WhyChooseUs />
                    <AboutUs />
                    <Blogs />
                    <Testimonials />
                    <ContactUs />
                </main>
                <Footer />
            </div>
        </>
    );
}
