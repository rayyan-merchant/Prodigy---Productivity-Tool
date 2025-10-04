
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  User,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';

// Store the current user
let currentUser: User | null = null;

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
  currentUser = user;
});

export const isAuthenticated = (): boolean => {
  return !!auth.currentUser || !!currentUser || localStorage.getItem('isAuthenticated') === 'true';
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser || currentUser;
};

export const isEmailVerified = (): boolean => {
  const user = getCurrentUser();
  return user?.emailVerified || false;
};

export const resendVerificationEmail = async (): Promise<void> => {
  try {
    const user = getCurrentUser();
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
      toast.success('Verification email sent! Please check your inbox.');
    } else {
      toast.error('No user found or email already verified.');
    }
  } catch (error) {
    console.error("Error sending verification email", error);
    toast.error('Failed to send verification email. Please try again.');
    throw error;
  }
};

export const signUp = async (email: string, password: string, name: string): Promise<User> => {
  try {
    // Create user
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with name
    await updateProfile(user, {
      displayName: name
    });

    // Store user data in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name,
      email,
      emailVerified: true, // Skip email verification
      createdAt: serverTimestamp()
    });

    // Create user settings document
    await setDoc(doc(db, 'users', user.uid, 'settings', 'preferences'), {
      theme: 'light',
      notificationsEnabled: true,
      createdAt: serverTimestamp()
    });

    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
    
    return user;
  } catch (error) {
    console.error("Error signing up", error);
    throw error;
  }
};

export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      // Update local storage for legacy support
      localStorage.setItem('userName', userData.name || user.displayName || '');
      localStorage.setItem('userEmail', userData.email || user.email || '');
    }
    
    localStorage.setItem('isAuthenticated', 'true');
    return user;
  } catch (error) {
    console.error("Error signing in", error);
    throw error;
  }
};

export const sendPasswordReset = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
    toast.success('Password reset email sent! Please check your inbox.');
  } catch (error) {
    console.error("Error sending password reset email", error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    // Remove localStorage items first before signing out
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userBio');
    localStorage.removeItem('profileImage');
    
    // Then sign out from Firebase - don't show toast since we'll redirect immediately
    await firebaseSignOut(auth);
    
    // No need for toast since we redirect immediately
    return Promise.resolve();
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};
