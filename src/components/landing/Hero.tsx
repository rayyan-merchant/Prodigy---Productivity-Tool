
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Hero: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="px-6 md:px-12 lg:px-24 py-16 text-center relative">
      {/* Background decorative circles */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#FFA5A5]/10 rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#FFA5A5]/10 rounded-full"></div>
      <div className="absolute top-60 left-40 w-20 h-20 bg-[#FFA5A5]/10 rounded-full"></div>
      
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
        Take Control Of Your Time.
      </h2>
      <p className="text-xl mb-4">
        Track, Focus, and Achieve more with less stress
      </p>
      <p className="max-w-2xl mx-auto mb-6 text-gray-600">
        Turn chaos into clarity with our task management system.
        <br />
        Set meaningful goals, work in focused sessions, and watch your productivity soar.
      </p>
      <Button 
        onClick={() => navigate('/auth')} 
        className="rounded-full bg-[#FFA5A5] hover:bg-[#ff8c8c] text-white px-8 py-6"
      >
        Start your Journey
      </Button>
    </div>
  );
};

export default Hero;
