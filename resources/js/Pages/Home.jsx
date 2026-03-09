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
    const seoTitle = "Home | Fortco Company Limited - Real Estate & Construction Management Tanzania";
    const seoDescription = "Fortco Company Limited provides the best unified platform for property management, construction tracking, and loan processing in Tanzania. Manage your projects with ease and efficiency.";
    const seoKeywords = "Fortco Company Limited, Real Estate Tanzania, Construction Management, Property Management Tanzania, Construction Tracking, Loan Processing Tanzania, Mwanza Real Estate";
    const siteUrl = window.location.origin;
    const ogImage = `${siteUrl}/logo_new.png`;

    return (
        <>
            <Head>
                <title>{seoTitle}</title>
                <meta name="description" content={seoDescription} />
                <meta name="keywords" content={seoKeywords} />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content={siteUrl} />
                <meta property="og:title" content={seoTitle} />
                <meta property="og:description" content={seoDescription} />
                <meta property="og:image" content={ogImage} />

                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content={siteUrl} />
                <meta property="twitter:title" content={seoTitle} />
                <meta property="twitter:description" content={seoDescription} />
                <meta property="twitter:image" content={ogImage} />
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
