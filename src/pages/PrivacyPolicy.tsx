import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import prodigyLogo from "/uploads/c4590b3f-facb-4ff8-ba27-1efd9f7c4e9f.png";
import useForceLightMode from '@/hooks/useForceLightMode';

const PrivacyPolicy: React.FC = () => {
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
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Privacy Policy</h1>
        <div className="text-gray-700 space-y-6">
          <div className="mb-4">
            <p className="mb-2 text-gray-500">Effective Date: May 3, 2025</p>
            <p className="mb-2 text-gray-500">Last Updated: May 3, 2025</p>
          </div>
          
          <p>Welcome to Prodigy — a productivity platform designed to help individuals manage tasks, take notes, track focus, and receive AI-powered insights. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website and services.</p>
          
          <div>
            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">1. Information We Collect</h2>
            <h3 className="font-medium mb-2">a. Personal Information</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Name, email address (from Firebase Auth or Google Sign-In)</li>
              <li>Profile preferences (e.g. dark mode, Pomodoro settings)</li>
            </ul>
  
            <h3 className="font-medium mb-2">b. Usage Data</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Task completion stats</li>
              <li>Notes and Pomodoro session history</li>
              <li>Clickstream data (buttons clicked, pages visited)</li>
            </ul>
  
            <h3 className="font-medium mb-2">c. Device & Technical Data</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Browser type, OS, screen resolution</li>
              <li>IP address (for security and analytics)</li>
              <li>Crash logs or errors</li>
            </ul>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">2. How We Use Your Information</h2>
            <p>We use your data to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Enable core features like task management, notes, and timers</li>
              <li>Personalize your experience (e.g. theme and productivity preferences)</li>
              <li>Provide AI-generated summaries and prioritization using Mistral AI</li>
              <li>Improve performance, detect bugs, and enhance usability</li>
              <li>Send occasional notifications or updates (if enabled)</li>
            </ul>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">3. AI Features and Third-Party APIs</h2>
            <p>We integrate Mistral AI to provide smart features such as:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Task summarization and prioritization</li>
              <li>Weekly productivity insights</li>
              <li>AI-powered note assistance</li>
            </ul>
            <p>Your content (e.g. tasks, notes) may be temporarily transmitted to Mistral's API for processing and generating responses. This data is not stored permanently by Prodigy or Mistral and is used only to provide real-time AI features. We do not store or share your content beyond what's strictly necessary for these services.</p>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">4. How We Store and Secure Your Data</h2>
            <p>We use Google Firebase to securely store your data:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Firestore for real-time database</li>
              <li>Firebase Auth for authentication</li>
              <li>Firebase Functions for backend AI integration</li>
            </ul>
            <p>All communication between your device and our servers is encrypted via HTTPS. Sensitive operations are authenticated and authorized using Firebase security rules.</p>
            <p>In the unlikely event of a data breach, we will promptly investigate and notify affected users in accordance with applicable laws and regulations.</p>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">5. User Controls and Data Retention</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>View and edit your data (e.g. notes, tasks)</li>
              <li>Delete your account and associated data permanently</li>
              <li>Manage privacy settings from the app dashboard</li>
            </ul>
            <p>Data is retained only as long as your account is active or required by legal/compliance reasons.</p>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">6. Cookies and Tracking</h2>
            <p>We use minimal cookies or local storage for:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Remembering session data (e.g. Pomodoro progress)</li>
              <li>Persisting theme and notification settings</li>
            </ul>
            <p>We do not use cookies for advertising or third-party tracking.</p>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">7. Children's Privacy</h2>
            <p>Prodigy is not intended for users under the age of 7. We do not knowingly collect personal data from children.</p>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">8. Changes to This Policy</h2>
            <p>We may update this Privacy Policy occasionally to reflect changes in our services or legal obligations. You will be notified of major updates via the app or email.</p>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">9. Legal Basis for Processing (For EU/UK Users)</h2>
            <p>If you are located in the EU/UK, we collect and process your data based on:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Your consent (e.g. signing up, enabling notifications)</li>
              <li>Contractual necessity (e.g. to provide services)</li>
              <li>Our legitimate interests (e.g. improving usability, ensuring security)</li>
            </ul>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">10. Contact Us</h2>
            <p>If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
            <p className="font-medium">📧 support@useprodigy.app</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
