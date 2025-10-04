
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Mail } from 'lucide-react';
import prodigyLogo from "/uploads/c4590b3f-facb-4ff8-ba27-1efd9f7c4e9f.png";
import useForceLightMode from '@/hooks/useForceLightMode';
 
interface DeveloperInfo {
  name: string;
  email: string;
  github: string;
  linkedin: string;
}
 
const Contact: React.FC = () => {
  const navigate = useNavigate();
  
  // Force light mode for contact page
  useForceLightMode();
 
  const developers: DeveloperInfo[] = [
    {
      name: "Riya Bhart",
      email: "riyabhart02@gmail.com",
      github: "https://github.com/RiyaBhart",
      linkedin: "http://www.linkedin.com/in/riya-bhart-339036287"
    },
    {
      name: "Rayyan Merchant",
      email: "merchantrayyan43@gmail.com",
      github: "https://github.com/rayyan-merchant",
      linkedin: "https://www.linkedin.com/in/rayyanmerchant2004/"
    },
    {
      name: "Syeda Rija Ali",
      email: "rija.ali@gmail.com",
      github: "https://github.com/Srijaali",
      linkedin: "https://www.linkedin.com/in/rija-ali-731095296/"
    }
  ];
 
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-12 lg:px-24 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <img src={prodigyLogo} alt="PRODIGY" className="h-6 sm:h-8" />
        </div>
        <Button 
          variant="ghost" 
          className="flex items-center text-gray-600 hover:text-gray-900"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={18} className="mr-2" />
          <span className="hidden sm:inline">Back to Home</span>
        </Button>
      </div>
 
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#FFC5C5] to-[#ffdddd] py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900">Get in Touch with the Prodigy Team</h1>
          <p className="text-lg sm:text-xl text-gray-700">We'd love to hear your feedback, answer questions, or just chat about productivity.</p>
        </div>
      </div>
 
      {/* Contact Info Section */}
      <div className="py-12 sm:py-16 px-4 sm:px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Contact Information</h2>
          <div className="flex items-center justify-center space-x-2 text-gray-700">
            <Mail className="h-5 w-5" />
            <a href="mailto:support@useprodigy.app" className="text-[#D2353E] hover:underline">
              support@useprodigy.app
            </a>
          </div>
        </div>
        
        {/* Developer Cards */}
        <h2 className="text-2xl font-bold mb-8 text-gray-900 text-center">Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto px-4">
          {developers.map((dev) => (
            <div 
              key={dev.name} 
              className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 sm:p-8 flex flex-col items-center transition-all duration-300 animate-fade-in"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-full mb-6 flex items-center justify-center overflow-hidden">
                <span className="text-3xl sm:text-4xl text-gray-500">{dev.name.charAt(0)}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{dev.name}</h3>
              
              <div className="flex space-x-4 mt-4">
                <a href={dev.github} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[#D2353E]" aria-label={`${dev.name}'s GitHub`}>
                  <Github className="h-5 w-5" />
                </a>
                <a href={dev.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[#D2353E]" aria-label={`${dev.name}'s LinkedIn`}>
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href={`mailto:${dev.email}`} className="text-gray-700 hover:text-[#D2353E]" aria-label={`Email ${dev.name}`}>
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
 
export default Contact;
