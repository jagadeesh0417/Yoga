'use client';

import HeroSection from '@/components/sections/HeroSection';
import BannerSection from '@/components/sections/BannerSection';
import WhyMysticYoga from '@/components/sections/WhyMysticYoga';
import BenefitsSection from '@/components/sections/BenefitsSection';
import AboutSunita from '@/components/sections/AboutSunita';
import PhilosophySection from '@/components/sections/PhilosophySection';
import MissionVision from '@/components/sections/MissionVision';
import ServicesSection from '@/components/sections/ServicesSection';
import PricingCards from '@/components/sections/PricingCards';
import MembershipSection from '@/components/sections/MembershipSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import BlogSection from '@/components/sections/BlogSection';
import TeacherTrainingSection from '@/components/sections/TeacherTrainingSection';
import CertificatesSection from '@/components/sections/CertificatesSection';
import EnquirySection from '@/components/sections/EnquirySection';
import CTASection from '@/components/sections/CTASection';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <BannerSection />
      <WhyMysticYoga />
      <BenefitsSection />
      <AboutSunita />
      <PhilosophySection />
      <MissionVision />
      <ServicesSection />
      <PricingCards />
      <MembershipSection />
      <CertificatesSection />
      <TestimonialsSection />
      <BlogSection />
      <TeacherTrainingSection />
      <EnquirySection />
      <CTASection />
    </main>
  );
}
