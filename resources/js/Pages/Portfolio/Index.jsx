import { Head } from '@inertiajs/react';

import Header from '../Home/sections/Header';
import Footer from '../Home/sections/Footer';
import Container from '../Home/components/Container';

import PortfolioHero from './sections/PortfolioHero';
import PortfolioOverview from './sections/PortfolioOverview';
import FeaturedProjects from './sections/FeaturedProjects';
import OngoingProjects from './sections/OngoingProjects';
import ProjectCategories from './sections/ProjectCategories';
import CSR from './sections/CSR';
import GalleryIndex from './sections/GalleryIndex';
import PerformanceMetrics from './sections/PerformanceMetrics';
import Partners from './sections/Partners';
import PressMedia from './sections/PressMedia';
import Awards from './sections/Awards';
import PortfolioTestimonials from './sections/PortfolioTestimonials';
import PortfolioContact from './sections/PortfolioContact';

export default function Index({ canLogin, canRegister, featuredProjects = [], ongoingProjects = [] }) {
    const seoTitle = "Portfolio | Fortco Company Limited - Construction & Real Estate Projects in Tanzania";
    const seoDescription = "Explore Fortco Company Limited's impressive portfolio of construction and real estate projects across Tanzania. View our completed residential, commercial, and institutional developments in Mwanza and beyond.";
    const seoKeywords = "Fortco Portfolio, Construction Projects Tanzania, Real Estate Projects Mwanza, Building Portfolio Tanzania, Construction Company Projects, Property Development Portfolio, Fortco Projects Tanzania";
    const siteUrl = window.location.origin;
    const ogImage = `${siteUrl}/logo_new.png`;
    const currentUrl = `${siteUrl}/portfolio`;
    
    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": `${siteUrl}/#organization`,
                "name": "Fortco Company Limited",
                "url": siteUrl,
                "logo": {
                    "@type": "ImageObject",
                    "url": ogImage,
                    "width": 512,
                    "height": 512
                },
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
                }
            },
            {
                "@type": "CreativeWork",
                "@id": `${currentUrl}/#portfolio`,
                "name": "Fortco Company Limited Portfolio",
                "description": seoDescription,
                "creator": {
                    "@id": `${siteUrl}/#organization`
                },
                "about": [
                    {
                        "@type": "Thing",
                        "name": "Construction Projects"
                    },
                    {
                        "@type": "Thing",
                        "name": "Real Estate Development"
                    },
                    {
                        "@type": "Thing",
                        "name": "Property Management"
                    }
                ]
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
                "inLanguage": "en-US"
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
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Portfolio",
                        "item": currentUrl
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
                    <PortfolioHero />

                    <section className="bg-white py-14">
                        <Container>
                            <div className="grid gap-10">
                                <PortfolioOverview />
                                <FeaturedProjects projects={featuredProjects} />
                                <OngoingProjects projects={ongoingProjects} />
                                <ProjectCategories />
                                <CSR />
                                <GalleryIndex />
                                <PerformanceMetrics />
                                <Partners />
                                <PressMedia />
                                <Awards />
                                <PortfolioTestimonials />
                                <PortfolioContact />
                            </div>
                        </Container>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
}
