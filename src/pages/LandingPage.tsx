import React from 'react';
import { Hero } from '../components/hero/Hero';
import { AboutBento } from '../components/about/AboutBento';
import { CatalogSection } from '../components/catalog/CatalogSection';
import { BenefitsSection } from '../components/benefits/BenefitsSection';
import { PricingSection } from '../components/pricing/PricingSection';
import { useScrollReveal } from '../hooks/useScrollReveal';

export const LandingPage: React.FC = () => {
  useScrollReveal('landing');

  return (
    <main>
      <Hero />
      <AboutBento />
      <CatalogSection />
      <BenefitsSection />
      <PricingSection />
    </main>
  );
};
