
import { db } from '@/lib/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { getCurrentUser } from '@/lib/auth';
import { createHabitActivity } from './activityService';
import { Habit } from '@/types/goals';

const convertFirestoreHabit = (doc: any): Habit => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name || data.title, // Handle both name and title for backwards compatibility
    description: data.description,
    category: data.category,
    frequency: data.frequency,
    targetStreak: data.targetStreak || data.targetCount || 7,
    currentStreak: data.currentStreak || 0,
    longestStreak: data.longestStreak || 0,
    isActive: data.isActive !== false,
    completedDates: data.completedDates || [],
    createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
  };
};

export const canCompleteHabitToday = (habit: Habit): boolean => {
  const today = new Date().toISOString().split('T')[0];
  return !habit.completedDates.includes(today);
};

export const getHabits = async (): Promise<Habit[]> => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const habitsRef = collection(db, 'users', user.uid, 'habits');
    const q = query(habitsRef, orderBy('updatedAt', 'desc'));
    
    const querySnapshot = await getDocs(q);
    const habits = querySnapshot.docs.map(convertFirestoreHabit);
    return habits;
  } catch (error) {
    console.error('Error getting habits:', error);
    throw error;
  }
};

export const createHabit = async (habitData: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Habit> => {
  const user = getCurrentUser();
  
  try {
    if (!user) {
      throw new Error('User not authenticated');
    }

    const now = serverTimestamp();
    const habitsRef = collection(db, 'users', user.uid, 'habits');
    
    const dataToSave = {
      ...habitData,
      createdAt: now,
      updatedAt: now,
      userId: user.uid
    };
    
    const docRef = await addDoc(habitsRef, dataToSave);

    // Create activity
    await createHabitActivity(
      'New habit created',
      `"${habitData.name}" habit was created`,
      docRef.id
    );

    return {
      id: docRef.id,
      ...habitData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating habit:', error);
    throw error;
  }
};

export const updateHabit = async (habitId: string, habitData: Partial<Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const habitRef = doc(db, 'users', user.uid, 'habits', habitId);
    
    await updateDoc(habitRef, {
      ...habitData,
      updatedAt: serverTimestamp()
    });
    
    // Create activity for habit updates
    if (habitData.name) {
      await createHabitActivity(
        'Habit updated',
        `"${habitData.name}" was updated`,
        habitId,
        habitData.currentStreak
      );
    }
  } catch (error) {
    console.error('Error updating habit:', error);
    throw error;
  }
};

export const completeHabit = async (habitId: string, habitTitle: string): Promise<void> => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const today = new Date().toISOString().split('T')[0];
    const habitRef = doc(db, 'users', user.uid, 'habits', habitId);
    
    // Get current habit data to update streak
    const habits = await getHabits();
    const habit = habits.find(h => h.id === habitId);
    
    if (habit) {
      const newStreak = habit.currentStreak + 1;
      const newLongestStreak = Math.max(habit.longestStreak, newStreak);
      
      await updateDoc(habitRef, {
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        completedDates: [...habit.completedDates, today],
        updatedAt: serverTimestamp()
      });

      // Create activity for habit completion
      await createHabitActivity(
        'Habit completed',
        `"${habitTitle}" completed - ${newStreak} day streak!`,
        habitId,
        newStreak
      );
    }
  } catch (error) {
    console.error('Error completing habit:', error);
    throw error;
  }
};

export const deleteHabit = async (habitId: string): Promise<void> => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get habit title before deletion
    const habits = await getHabits();
    const habit = habits.find(h => h.id === habitId);
    const habitTitle = habit?.name || 'Unknown habit';

    const habitRef = doc(db, 'users', user.uid, 'habits', habitId);
    await deleteDoc(habitRef);
    
    // Create activity
    await createHabitActivity(
      'Habit deleted',
      `"${habitTitle}" was deleted`,
      habitId
    );
  } catch (error) {
    console.error('Error deleting habit:', error);
    throw error;
  }
};
