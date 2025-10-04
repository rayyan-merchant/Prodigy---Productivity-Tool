
import React, { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { signIn, sendPasswordReset } from "@/lib/auth";
import { toast } from "sonner";
import GoogleSignInButton from './GoogleSignInButton';
import { Eye, EyeOff } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Define form schema
const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const resetSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type FormData = z.infer<typeof formSchema>;
type ResetFormData = z.infer<typeof resetSchema>;

interface SignInFormProps {
  onToggleMode: () => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ onToggleMode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const navigate = useNavigate();

  // Initialize form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Initialize reset form
  const resetForm = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  // Form submission handler
  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      await signIn(data.email, data.password);
      
      toast.success("Signed in successfully!");
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onResetSubmit = async (data: ResetFormData) => {
    try {
      setIsResetting(true);
      await sendPasswordReset(data.email);
      setShowResetDialog(false);
      resetForm.reset();
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error("Failed to send password reset email. Please try again.");
    } finally {
      setIsResetting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="w-full space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-gray-600">
            Sign in to your PRODIGY account
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your@email.com"
                      type="email"
                      disabled={isLoading}
                      className="rounded-md"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        disabled={isLoading}
                        className="rounded-md pr-10"
                        {...field}
                      />
                      <button 
                        type="button" 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-[#D2353E] hover:underline"
                onClick={() => setShowResetDialog(true)}
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#D2353E] hover:bg-[#D2353E]/90 transition-transform hover:scale-[1.01] rounded-md py-2.5"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
            
            <div className="text-center text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <button 
                type="button"
                className="text-[#D2353E] hover:underline font-medium"
                onClick={onToggleMode}
              >
                Sign up
              </button>
            </div>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <GoogleSignInButton />
          </form>
        </Form>
      </div>

      {/* Password Reset Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          
          <Form {...resetForm}>
            <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
              <FormField
                control={resetForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email address"
                        type="email"
                        disabled={isResetting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowResetDialog(false)}
                  disabled={isResetting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isResetting}
                  className="bg-[#D2353E] hover:bg-[#D2353E]/90"
                >
                  {isResetting ? "Sending..." : "Send Reset Email"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SignInForm;
