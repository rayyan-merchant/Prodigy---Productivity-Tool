
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import prodigyLogo from "/uploads/c4590b3f-facb-4ff8-ba27-1efd9f7c4e9f.png";
import useForceLightMode from '@/hooks/useForceLightMode';

const TermsOfService: React.FC = () => {
  const navigate = useNavigate();
  useForceLightMode();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 md:px-12 lg:px-24 border-b border-gray-200">
        <div className="flex items-center">
          <img src={prodigyLogo} alt="PRODIGY" className="h-8" />
        </div>
        <Button 
          variant="ghost" 
          className="flex items-center text-gray-600 hover:text-gray-900 hover:bg-[#D2353E]/10"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Home
        </Button>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Terms of Service</h1>
        <div className="text-gray-700 space-y-6">
          <div className="mb-4">
            <p className="mb-2 text-gray-500">Effective Date: May 3, 2025</p>
            <p className="mb-2 text-gray-500">Last Updated: May 3, 2025</p>
          </div>
          
          <p>Welcome to Prodigy — a productivity platform designed for individuals and students to manage tasks, take notes, track focus, and receive AI-powered insights. These Terms of Service ("Terms") govern your use of our website, services, and applications (collectively, the "Service"). By accessing or using Prodigy, you agree to be bound by these Terms.</p>
          
          <div>
            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">1. Eligibility</h2>
            <p>You must be at least 13 years old to use Prodigy. By using our Service, you confirm that you meet this requirement and have the legal capacity to enter into these Terms.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">2. User Accounts</h2>
            <p>To access key features, you must create an account using your email or Google Sign-In. You agree to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide accurate and up-to-date information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately if you suspect unauthorized use of your account</li>
            </ul>
            <p>You are responsible for all activities under your account.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">3. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Use the Service for any unlawful, harmful, or misleading purpose</li>
              <li>Interfere with or disrupt the security or accessibility of the platform</li>
              <li>Reverse engineer, copy, or resell parts of the Service without permission</li>
              <li>Use bots, scrapers, or automated tools to access or misuse data</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">4. Intellectual Property</h2>
            <p>All content, design elements, and features on Prodigy are owned by us or our licensors. You may not reproduce, distribute, or create derivative works without explicit permission. Your tasks, notes, and personal content remain your property.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">5. AI Services Disclaimer</h2>
            <p>We integrate third-party AI providers such as Mistral AI to offer smart features like:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>AI task prioritization</li>
              <li>Summarization of notes and tasks</li>
              <li>Weekly productivity insights</li>
            </ul>
            <p>While we aim for accuracy, AI-generated content may not always be perfect. You are responsible for reviewing and verifying AI suggestions before acting on them.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">6. Service Availability</h2>
            <p>We strive to keep Prodigy online and functional, but we do not guarantee 100% uptime. We may temporarily suspend or limit access for maintenance, updates, or unexpected outages.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">7. Termination</h2>
            <p>You can stop using Prodigy at any time. We reserve the right to suspend or delete accounts that violate these Terms or engage in harmful behavior, with or without notice.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">8. Limitation of Liability</h2>
            <p>To the maximum extent allowed by law, Prodigy and its creators are not liable for:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Any indirect, incidental, or consequential damages</li>
              <li>Loss of data, productivity, or profits</li>
              <li>Errors or delays caused by third-party services (e.g., AI APIs, Firebase)</li>
            </ul>
            <p>Use of the platform is at your own risk.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">9. Modifications to These Terms</h2>
            <p>We may update these Terms to reflect changes to our services or legal obligations. If we make significant changes, we will notify you through the app or by email.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">10. Governing Law</h2>
            <p>These Terms are governed by and construed in accordance with the laws of the jurisdiction in which the platform is maintained, without regard to conflict of law principles.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">11. Contact Us</h2>
            <p>If you have questions about these Terms, please contact us at:</p>
            <p className="font-medium">📧 support@useprodigy.app</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
