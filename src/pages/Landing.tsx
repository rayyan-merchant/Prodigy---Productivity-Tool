
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import FeaturePreview from '@/components/landing/FeaturePreview';
import FAQ from '@/components/landing/FAQ';
import Footer from '@/components/landing/Footer';
import useForceLightMode from '@/hooks/useForceLightMode';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  
  // Force light mode for landing page
  useForceLightMode();

  return (
    <div className="bg-white min-h-screen text-gray-900">
      <Header />
      <Hero />
      <HowItWorks />
      <FeaturePreview />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Landing;
