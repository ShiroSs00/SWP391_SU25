import React from 'react';
import  HeroSection  from '../components/home/HeroSection.tsx';
import { FeaturesSection } from '../components/home/FeaturesSection.tsx';
import { NewsSection } from '../components/home/NewsSections.tsx';
import { TestimonialsSection } from '../components/home/TestimonialsSection.tsx';
import ProcessSection from '../components/home/ProcessSection.tsx';
import UpcomingEvents from '../components/home/UpcomingEvents.tsx';

const HomePage: React.FC = () => {


    return (
        <main>
                <div className="flex-1 min-h-0 bg-rose-50">
            <HeroSection />
            <FeaturesSection />
            <ProcessSection />
            <UpcomingEvents />
            <NewsSection />
            <TestimonialsSection />
            </div>
        </main>
    );
};

export default HomePage;