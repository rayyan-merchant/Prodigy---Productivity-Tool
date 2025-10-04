
import { db } from '@/lib/firebase';
import { collection, doc, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { getCurrentUser } from '@/lib/auth';
import { Activity } from '@/types/goals';

// Create a new activity entry
export const createActivity = async (activityData: Omit<Activity, 'id' | 'timestamp'>): Promise<void> => {
  try {
    const user = getCurrentUser();
    if (!user) {
      return;
    }

    const activitiesRef = collection(db, 'users', user.uid, 'activities');
    
    const dataToSave = {
      ...activityData,
      timestamp: serverTimestamp(),
      userId: user.uid
    };
    
    await addDoc(activitiesRef, dataToSave);
  } catch (error) {
    console.error('Error creating activity:', error);
  }
};

// Get recent activities for the current user
export const getRecentActivities = async (limitCount: number = 10): Promise<Activity[]> => {
  try {
    const user = getCurrentUser();
    if (!user) {
      return [];
    }

    const activitiesRef = collection(db, 'users', user.uid, 'activities');
    
    const q = query(activitiesRef, orderBy('timestamp', 'desc'), limit(limitCount));
    
    const querySnapshot = await getDocs(q);
    const activities = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        type: data.type,
        title: data.title,
        description: data.description,
        timestamp: data.timestamp?.toDate?.()?.toISOString() || data.timestamp,
        metadata: data.metadata || {}
      } as Activity;
    });
    
    return activities;
  } catch (error) {
    console.error('Error getting activities:', error);
    return [];
  }
};

// Helper functions to create specific activity types
export const createTaskActivity = async (title: string, description: string, taskId: string) => {
  await createActivity({
    type: 'task',
    title,
    description,
    metadata: { taskId }
  });
};

export const createNoteActivity = async (title: string, description: string, noteId: string) => {
  await createActivity({
    type: 'note',
    title,
    description,
    metadata: { noteId }
  });
};

export const createHabitActivity = async (title: string, description: string, habitId: string, streak?: number) => {
  await createActivity({
    type: 'habit',
    title,
    description,
    metadata: { habitId, streak }
  });
};

export const createSessionActivity = async (title: string, description: string, duration: number) => {
  await createActivity({
    type: 'session',
    title,
    description,
    metadata: { duration }
  });
};

export const createGoalActivity = async (title: string, description: string, goalId: string, progress?: number) => {
  await createActivity({
    type: 'goal',
    title,
    description,
    metadata: { goalId, progress }
  });
};

export const createSettingsActivity = async (title: string, description: string, settingType: string) => {
  await createActivity({
    type: 'settings',
    title,
    description,
    metadata: { settingType }
  });
};
