import React from 'react';
import HeroSection from '../components/home/HeroSection';
import CategoryGrid from '../components/home/CategoryGrid';
import FeaturedProfessionals from '../components/home/FeaturedProfessionals';
import Testimonials from '../components/home/Testimonials';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategoryGrid />
      <FeaturedProfessionals />
      <Testimonials />
    </div>
  );
};

export default Home;