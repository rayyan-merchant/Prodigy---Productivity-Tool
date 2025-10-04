
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mail, RefreshCw, CheckCircle, ArrowLeft } from 'lucide-react';
import { getCurrentUser, resendVerificationEmail, isEmailVerified } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import prodigyLogo from "/uploads/c4590b3f-facb-4ff8-ba27-1efd9f7c4e9f.png";

const EmailVerification: React.FC = () => {
  const [isResending, setIsResending] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUserEmail(user.email || '');
    }

    // Listen for auth state changes to check if email is verified
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        navigate('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleResendVerification = async () => {
    try {
      setIsResending(true);
      await resendVerificationEmail();
    } catch (error) {
      console.error('Error resending verification email:', error);
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = () => {
    const user = getCurrentUser();
    if (user) {
      user.reload().then(() => {
        if (user.emailVerified) {
          navigate('/dashboard');
        }
      });
    }
  };

  const handleBackToLanding = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center">
        {/* Back Button */}
        <div className="flex justify-start mb-4">
          <Button
            variant="ghost"
            onClick={handleBackToLanding}
            className="text-gray-600 hover:text-gray-800 p-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="flex justify-center mb-6">
          <img src={prodigyLogo} alt="PRODIGY" className="h-8" />
        </div>
        
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-4 rounded-full">
            <Mail className="h-12 w-12 text-blue-600" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Verify Your Email
        </h2>
        
        <p className="text-gray-600 mb-6">
          We've sent a verification email to <strong>{userEmail}</strong>. 
          Please click the link in the email to verify your account.
        </p>
        
        <div className="space-y-4">
          <Button 
            onClick={handleCheckVerification}
            className="w-full bg-[#D2353E] hover:bg-[#D2353E]/90"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            I've Verified My Email
          </Button>
          
          <Button
            variant="outline"
            onClick={handleResendVerification}
            disabled={isResending}
            className="w-full"
          >
            {isResending ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Resend Verification Email
              </>
            )}
          </Button>
        </div>
        
        <p className="text-sm text-gray-500 mt-6">
          Didn't receive the email? Check your spam folder or try resending.
        </p>
      </Card>
    </div>
  );
};

export default EmailVerification;
