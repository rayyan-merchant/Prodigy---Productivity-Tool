
import React from 'react';
import { Link } from 'react-router-dom';
import prodigyLogo from "/uploads/c4590b3f-facb-4ff8-ba27-1efd9f7c4e9f.png"; // Updated logo

const Footer: React.FC = () => {
  return (
    <footer className="px-6 md:px-12 lg:px-24 py-12 border-t border-gray-200">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="mb-6 md:mb-0">
          <img src={prodigyLogo} alt="PRODIGY" className="h-8 mb-4" />
        </div>
        <div className="flex flex-col md:flex-row md:space-x-8 space-y-2 md:space-y-0 text-sm text-gray-500">
           <Link to="/terms-of-service" className="hover:text-[#D2353E]">Terms of Service</Link>
           <Link to="/privacy-policy" className="hover:text-[#D2353E]">Privacy Policy</Link>
           <Link to="/contact" className="hover:text-[#D2353E]">Contact</Link>
          <span>&copy; {new Date().getFullYear()} Prodigy</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
