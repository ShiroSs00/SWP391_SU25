import React from 'react';
import { HeroSection } from '../../components/home/HeroSection';
import { StatsSection } from '../../components/home/StatsSection';
import { FeaturesSection } from '../../components/home/FeaturesSection';
import { EmergencySection } from '../../components/home/EmergencySection';
import { BloodTypesSection } from '../../components/home/BloodTypeSection';
import { TestimonialsSection } from '../../components/home/TestimonialsSection';
import {Header} from "../../components/layouts/Header.tsx";
import {Footer} from "../../components/layouts/Footer.tsx";

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