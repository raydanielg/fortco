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
    return (
        <>
            <Head title="Home" />
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
