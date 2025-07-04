import React from 'react';
import { HeroSection } from '../components/home/HeroSection.tsx';
import { StatsSection } from '../components/home/StatsSection.tsx';
import { FeaturesSection } from '../components/home/FeaturesSection.tsx';
import { LatestBlogs} from "../features/blog/components/LatestBlogs.tsx";
import { TestimonialsSection } from '../components/home/TestimonialsSection.tsx';
const HomePage: React.FC = () => {


    return (
        <main>
                <div className="flex-1">
            <HeroSection />
            <StatsSection />
            <LatestBlogs />
            <FeaturesSection />
            <TestimonialsSection />
            </div>
        </main>
    );
};

export default HomePage;