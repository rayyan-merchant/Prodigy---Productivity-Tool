
import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LayoutWrapper from "./components/LayoutWrapper";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Goals from "./pages/Goals";
import Habits from "./pages/Habits";
import NotFound from "./pages/NotFound";
import PomodoroTimer from "./pages/PomodoroTimer";
import Notes from "./pages/Notes";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Contact from "./pages/Contact";
import { TimerProvider } from "./contexts/TimerContext";
import FullNoteEditor from "./components/notes/FullNoteEditor";
import ProtectedRoute from "./components/ProtectedRoute";
import { isAuthenticated } from "./lib/auth";
import { auth } from "./lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import ErrorBoundary from "./components/ErrorBoundary";
import GlobalSearch from "./components/GlobalSearch";
import OfflineIndicator from "./components/OfflineIndicator";
import GlobalKeyboardListener from "./components/GlobalKeyboardListener";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useOffline } from "./hooks/useOffline";

// Ensure consistent theme across the app
const applyTheme = () => {
  const theme = localStorage.getItem('theme') || 'light';
  const root = window.document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Configure sonner toast defaults
import { toast } from 'sonner';
toast.success = (message, options) => toast(message, { ...options, style: { backgroundColor: 'white', color: 'black' } });
toast.error = (message, options) => toast(message, { ...options, style: { backgroundColor: 'white', color: 'black' } });

const AppContent = () => {
  const [authChecked, setAuthChecked] = useState(false);
  
  // Initialize keyboard shortcuts
  useKeyboardShortcuts();
  
  // Initialize offline functionality
  const { isOnline } = useOffline();

  useEffect(() => {
    // Apply theme on initial load
    applyTheme();
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // If user exists, we are authenticated
      if (user) {
        localStorage.setItem('isAuthenticated', 'true');
        // Store basic user info in localStorage for legacy support
        if (user.displayName) localStorage.setItem('userName', user.displayName);
        if (user.email) localStorage.setItem('userEmail', user.email);
        if (user.photoURL) localStorage.setItem('profileImage', user.photoURL);
      } else {
        // Clear auth state if user is null
        localStorage.removeItem('isAuthenticated');
      }
      // Mark auth as checked so we can render the app
      setAuthChecked(true);
    });

    // Handle theme toggle events
    const handleThemeToggle = () => {
      const currentTheme = localStorage.getItem('theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      applyTheme();
      toast.success(`${newTheme === 'light' ? 'Light' : 'Dark'} mode activated`);
    };

    window.addEventListener('toggleTheme', handleThemeToggle);

    // Clean up subscription on unmount
    return () => {
      unsubscribe();
      window.removeEventListener('toggleTheme', handleThemeToggle);
    };
  }, []);

  // Don't render the app until we've checked authentication
  if (!authChecked) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <GlobalKeyboardListener />
      <Routes>
        {/* Public routes - always in light mode */}
        <Route path="/" element={
          isAuthenticated() ? <Navigate to="/dashboard" /> : <Landing />
        } />
        <Route path="/auth" element={
          isAuthenticated() ? <Navigate to="/dashboard" /> : <Auth />
        } />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Protected routes */}
        <Route element={
          <ProtectedRoute>
            <LayoutWrapper />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/notes/edit/:id" element={<FullNoteEditor />} />
          <Route path="/notes/edit" element={<FullNoteEditor />} />
        </Route>
        
        {/* Pomodoro route - separate since it has its own layout */}
        <Route path="/pomodoro" element={
          <ProtectedRoute>
            <PomodoroTimer />
          </ProtectedRoute>
        } />
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <TimerProvider>
            <Toaster />
            <Sonner />
            <OfflineIndicator />
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </TimerProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
