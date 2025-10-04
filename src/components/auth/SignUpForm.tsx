
import React, { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { signUp } from '@/lib/auth';
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

// Define form schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof formSchema>;

interface SignUpFormProps {
  onToggleMode: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onToggleMode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Initialize form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Form submission handler - Updated to skip email verification and redirect to dashboard
  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      
      await signUp(data.email, data.password, data.name);
      
      toast.success("Account created successfully!");
      navigate('/dashboard');
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
        <p className="mt-2 text-gray-600">
          Join PRODIGY to boost your productivity
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
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

          <Button
            type="submit"
            className="w-full bg-[#D2353E] hover:bg-[#D2353E]/90 transition-transform hover:scale-[1.01] rounded-md py-2.5"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Sign up"}
          </Button>
          
          <div className="text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <button 
              type="button"
              className="text-[#D2353E] hover:underline font-medium"
              onClick={onToggleMode}
            >
              Sign in
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
  );
};

export default SignUpForm;
