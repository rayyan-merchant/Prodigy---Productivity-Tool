
import React from 'react';

const Background: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 z-0 bg-cover bg-center" 
      style={{ 
        backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070')`,
        filter: 'brightness(0.6)'
      }}
    />
  );
};

export default Background;
