
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import prodigyLogo from "/uploads/c4590b3f-facb-4ff8-ba27-1efd9f7c4e9f.png"; // Updated logo

const Header: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <nav className="px-6 py-4 md:px-12 lg:px-24 flex justify-between items-center">
      <div className="h-12">
        <img src={prodigyLogo} alt="PRODIGY" className="h-full" />
      </div>
      <Button 
        onClick={() => navigate('/auth')} 
        className="rounded-full bg-[#D2353E] hover:bg-[#b22d35] text-white"
      >
        SIGN IN
      </Button>
    </nav>
  );
};

export default Header;
