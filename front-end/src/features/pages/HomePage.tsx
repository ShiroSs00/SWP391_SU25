import { HeroSection } from '../../components/home/HeroSection';
import { StatsSection } from '../../components/home/StatsSection';
import { FeaturesSection } from '../../components/home/FeaturesSection';
import { BloodTypesSection } from '../../components/home/BloodTypesSection';
import { EmergencySection } from '../../components/home/EmergencySection';
import { TestimonialsSection } from '../../components/home/TestimonialsSection';

export function HomePage() {
    return (
        <div>
            <HeroSection />
            <StatsSection />
            <FeaturesSection />
            <BloodTypesSection />
            <EmergencySection />
            <TestimonialsSection />
        </div>
    );
}