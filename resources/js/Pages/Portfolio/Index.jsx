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
    return (
        <>
            <Head title="Portfolio" />
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
