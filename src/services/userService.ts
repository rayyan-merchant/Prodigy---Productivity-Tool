
import { db, storage, auth } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { createSettingsActivity } from './activityService';

// User profile interface
interface UserProfile {
  name: string;
  email: string;
  photoURL?: string;
  bio?: string;
  createdAt?: any;
  updatedAt?: any;
}

// User settings interface
interface UserSettings {
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
  workDuration?: number;
  shortBreakDuration?: number;
  longBreakDuration?: number;
  longBreakInterval?: number;
}

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

/**
 * Get user settings from Firestore
 */
export const getUserSettings = async (userId: string): Promise<UserSettings | null> => {
  try {
    const settingsRef = doc(db, 'users', userId, 'settings', 'preferences');
    const settingsSnap = await getDoc(settingsRef);
    
    if (settingsSnap.exists()) {
      return settingsSnap.data() as UserSettings;
    }
    
    // Return default settings if none exist
    return {
      theme: 'light',
      notificationsEnabled: true,
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      longBreakInterval: 4
    };
  } catch (error) {
    console.error('Error getting user settings:', error);
    throw error;
  }
};

/**
 * Update user settings in Firestore
 */
export const updateUserSettings = async (userId: string, settings: Partial<UserSettings>): Promise<void> => {
  try {
    const settingsRef = doc(db, 'users', userId, 'settings', 'preferences');
    await updateDoc(settingsRef, {
      ...settings,
      updatedAt: serverTimestamp()
    });

    // Create activity for settings changes
    const settingKeys = Object.keys(settings);
    if (settingKeys.length > 0) {
      const settingType = settingKeys[0];
      await createSettingsActivity(
        'Settings updated',
        `${settingType} setting was changed`,
        settingType
      );
    }
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw error;
  }
};

/**
 * Update user profile in Firestore and Auth
 */
export const updateUserProfile = async (userId: string, profileData: Partial<UserProfile>): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    
    // Update Firestore profile
    await updateDoc(userRef, {
      ...profileData,
      updatedAt: serverTimestamp()
    });
    
    // Update Auth profile if user is current user
    if (auth.currentUser && auth.currentUser.uid === userId) {
      await updateProfile(auth.currentUser, {
        displayName: profileData.name,
        photoURL: profileData.photoURL
      });
    }

    // Create activity for profile updates
    await createSettingsActivity(
      'Profile updated',
      'Profile information was updated',
      'profile'
    );
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Upload a profile image to Firebase Storage
 */
export const uploadProfileImage = async (userId: string, file: File): Promise<string> => {
  try {
    // Create a storage reference
    const storageRef = ref(storage, `users/${userId}/profile/${file.name}`);
    
    // Upload the file
    await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    // Update the user profile with the new photo URL
    await updateUserProfile(userId, { photoURL: downloadURL });
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
};

/**
 * Create default user document in Firestore
 */
export const createUserDocument = async (userId: string, userData: { name: string, email: string }): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    // Only create if it doesn't exist
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        name: userData.name,
        email: userData.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Create default settings
      const settingsRef = doc(db, 'users', userId, 'settings', 'preferences');
      await setDoc(settingsRef, {
        theme: 'light',
        notificationsEnabled: true,
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        longBreakInterval: 4,
        createdAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
};

/**
 * Generate random avatar from user initials
 * For users without profile pictures
 */
export const generateInitialsAvatar = (name: string): string => {
  const colors = [
    '#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
    '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC'
  ];
  
  // Get initials
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
  
  // Get a deterministic color based on name
  const colorIndex = Math.abs(name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)) % colors.length;
  const color = colors[colorIndex];
  
  // Create a data URI for an SVG
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="${color}" />
      <text x="50" y="50" font-family="Arial" font-size="35" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">${initials}</text>
    </svg>
  `)}`;
};
