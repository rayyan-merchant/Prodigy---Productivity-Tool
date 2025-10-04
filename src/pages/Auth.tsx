
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import prodigyLogo from "/uploads/c4590b3f-facb-4ff8-ba27-1efd9f7c4e9f.png";
import useForceLightMode from '@/hooks/useForceLightMode';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  
  // Force light mode for auth pages
  useForceLightMode();

  const handleToggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const handleBackToLanding = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4 md:p-6">
      {/* Back button - positioned absolutely */}
      <Button
        variant="ghost"
        className="absolute top-4 left-4 p-2 flex items-center text-gray-600 hover:text-gray-900 hover:bg-[#D2353E]/10"
        onClick={handleBackToLanding}
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to Home
      </Button>
      
      {/* Main card */}
      <div className="w-full max-w-5xl overflow-hidden bg-white rounded-xl shadow-lg flex flex-col md:flex-row">
        {/* Form section (left side) */}
        <div className="w-full md:w-3/5 p-8 md:p-12">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src={prodigyLogo} alt="PRODIGY" className="h-8" />
          </div>
          
          {/* Form */}
          <div className="max-w-md mx-auto">
            {isLogin ? <SignInForm onToggleMode={handleToggleAuthMode} /> : <SignUpForm onToggleMode={handleToggleAuthMode} />}
          </div>
        </div>
        
        {/* Brand section (right side) */}
        <div className="w-full md:w-2/5 bg-[#D2353E] text-white p-8 md:p-12 flex flex-col justify-center items-center text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">
            {isLogin ? "Hello again!" : "Join Prodigy!"}
          </h2>
          <p className="mb-6">
            {isLogin 
              ? "Access your productivity tools and notes." 
              : "One dashboard for all your focus needs."
            }
          </p>
          <Button 
            variant="outline" 
            className="border-2 border-white text-white hover:bg-white/10 hover:text-white hover:border-white"
            onClick={handleToggleAuthMode}
          >
            {isLogin ? "Create Account" : "Sign In"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
