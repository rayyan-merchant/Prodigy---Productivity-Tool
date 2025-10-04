
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { getCurrentUser } from '@/lib/auth';

export interface PomodoroSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundEnabled: boolean;
  soundTheme: string;
  notifications: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  soundEnabled: true,
  soundTheme: 'default',
  notifications: true
};

// Get user's pomodoro settings
export const getPomodoroSettings = async (): Promise<PomodoroSettings> => {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const settingsRef = doc(db, 'users', user.uid, 'settings', 'pomodoro');
    const settingsDoc = await getDoc(settingsRef);
    
    if (settingsDoc.exists()) {
      const data = settingsDoc.data();
      return {
        ...DEFAULT_SETTINGS,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
      };
    } else {
      // Create default settings
      return await savePomodoroSettings(DEFAULT_SETTINGS);
    }
  } catch (error) {
    console.error('Error getting pomodoro settings:', error);
    return DEFAULT_SETTINGS;
  }
};

// Save user's pomodoro settings
export const savePomodoroSettings = async (settings: Partial<PomodoroSettings>): Promise<PomodoroSettings> => {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const settingsRef = doc(db, 'users', user.uid, 'settings', 'pomodoro');
    const now = serverTimestamp();
    
    // Create the data object for Firestore (without createdAt/updatedAt from settings)
    const { createdAt, updatedAt, ...settingsWithoutTimestamps } = settings;
    const firestoreData: any = {
      ...settingsWithoutTimestamps,
      updatedAt: now
    };

    // If this is the first time saving, add createdAt
    const existingDoc = await getDoc(settingsRef);
    if (!existingDoc.exists()) {
      firestoreData.createdAt = now;
    }

    await setDoc(settingsRef, firestoreData, { merge: true });
    
    // Return the settings with string timestamps for the interface
    const currentTime = new Date().toISOString();
    return {
      ...DEFAULT_SETTINGS,
      ...settingsWithoutTimestamps,
      createdAt: currentTime,
      updatedAt: currentTime
    };
  } catch (error) {
    console.error('Error saving pomodoro settings:', error);
    throw error;
  }
};
