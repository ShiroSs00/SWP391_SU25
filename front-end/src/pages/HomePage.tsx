import React from 'react';
import { HeroSection } from '../components/home/HeroSection.tsx';
import { StatsSection } from '../components/home/StatsSection.tsx';
import { FeaturesSection } from '../components/home/FeaturesSection.tsx';
import { EmergencySection } from '../components/home/EmergencySection.tsx';
import { BloodTypesSection } from '../components/home/BloodTypeSection.tsx';
import { TestimonialsSection } from '../components/home/TestimonialsSection.tsx';
import {Header} from "../components/layouts/Header.tsx";
import Footer from "../components/layouts/Footer.tsx";

const HomePage: React.FC = () => {
    return (
        <main>
            <Header />
            <HeroSection />
            <StatsSection />
            <FeaturesSection />
            <EmergencySection />
            <BloodTypesSection />
            <TestimonialsSection />
            <Footer />
        </main>
    );
};

export default HomePage;