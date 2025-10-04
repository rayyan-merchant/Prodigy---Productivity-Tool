
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { logout } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';

const AccountActions: React.FC = () => {
  const navigate = useNavigate();

  // Handle sign out
  const handleSignOut = async () => {
    try {
      const signOutPromise = logout();
      toast.loading("Signing out...", { id: "signout-toast" });
      await signOutPromise;
      toast.dismiss("signout-toast");
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Actions</CardTitle>
        <CardDescription>
          Manage your account access
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          variant="destructive" 
          onClick={handleSignOut}
          className="bg-[#D2353E] hover:bg-[#D2353E]/90 flex items-center gap-2"
        >
          <LogOut size={16} /> Sign Out
        </Button>
      </CardContent>
    </Card>
  );
};

export default AccountActions;
