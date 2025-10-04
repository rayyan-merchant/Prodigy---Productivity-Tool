
import { db } from '@/lib/firebase';
import { collection, doc, addDoc, getDoc, getDocs, query, where, orderBy, serverTimestamp, Timestamp, limit, deleteDoc, updateDoc } from 'firebase/firestore';
import { getCurrentUser } from '@/lib/auth';

export interface PomodoroSession {
  id?: string;
  duration: number;  // in minutes
  date: Date | string;
  type: 'focus' | 'short-break' | 'long-break';
  interruptions?: number;
  completed: boolean;
  project?: string;
  tags?: string[];
  notes?: string;
  taskId?: string;  // Link to task
  taskTitle?: string; // Store task title for analytics
  userId?: string;
  createdAt?: Timestamp | Date;
}

/**
 * Save a new Pomodoro session to Firestore
 */
export const saveSession = async (session: Omit<PomodoroSession, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const sessionRef = collection(db, 'users', user.uid, 'sessions');
    
    const docRef = await addDoc(sessionRef, {
      ...session,
      userId: user.uid,
      createdAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error saving session:', error);
    throw error;
  }
};

/**
 * Get all Pomodoro sessions for the current user
 */
export const getAllSessions = async (): Promise<PomodoroSession[]> => {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const sessionsRef = collection(db, 'users', user.uid, 'sessions');
    const q = query(sessionsRef, orderBy('date', 'desc'));
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        duration: data.duration,
        date: data.date?.toDate?.() || data.date,
        type: data.type,
        interruptions: data.interruptions || 0,
        completed: data.completed || false,
        project: data.project,
        tags: data.tags || [],
        notes: data.notes,
        taskId: data.taskId,
        taskTitle: data.taskTitle
      };
    });
  } catch (error) {
    console.error('Error getting all sessions:', error);
    return [];
  }
};

/**
 * Get Pomodoro sessions by date range
 */
export const getSessionsByDateRange = async (startDate: Date, endDate: Date): Promise<PomodoroSession[]> => {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const sessionsRef = collection(db, 'users', user.uid, 'sessions');
    const q = query(
      sessionsRef,
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        duration: data.duration,
        date: data.date?.toDate?.() || data.date,
        type: data.type,
        interruptions: data.interruptions || 0,
        completed: data.completed || false,
        project: data.project,
        tags: data.tags || [],
        notes: data.notes,
        taskId: data.taskId,
        taskTitle: data.taskTitle
      };
    });
  } catch (error) {
    console.error('Error getting sessions by date range:', error);
    return [];
  }
};

/**
 * Get a single session by ID
 */
export const getSessionById = async (sessionId: string): Promise<PomodoroSession | null> => {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const sessionRef = doc(db, 'users', user.uid, 'sessions', sessionId);
    const sessionSnap = await getDoc(sessionRef);
    
    if (sessionSnap.exists()) {
      const data = sessionSnap.data();
      return {
        id: sessionSnap.id,
        duration: data.duration,
        date: data.date?.toDate?.() || data.date,
        type: data.type,
        interruptions: data.interruptions || 0,
        completed: data.completed || false,
        project: data.project,
        tags: data.tags || [],
        notes: data.notes
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting session:', error);
    throw error;
  }
};

/**
 * Update a session
 */
export const updateSession = async (sessionId: string, sessionData: Partial<PomodoroSession>): Promise<void> => {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const sessionRef = doc(db, 'users', user.uid, 'sessions', sessionId);
    await updateDoc(sessionRef, sessionData);
  } catch (error) {
    console.error('Error updating session:', error);
    throw error;
  }
};

/**
 * Delete a session
 */
export const deleteSession = async (sessionId: string): Promise<void> => {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const sessionRef = doc(db, 'users', user.uid, 'sessions', sessionId);
    await deleteDoc(sessionRef);
  } catch (error) {
    console.error('Error deleting session:', error);
    throw error;
  }
};

/**
 * Get session statistics
 */
export const getSessionStats = async (): Promise<{
  totalSessions: number;
  totalFocusTime: number;
  totalInterruptions: number;
  averageSessionLength: number;
}> => {
  try {
    const sessions = await getAllSessions();
    
    // Only count completed focus sessions
    const focusSessions = sessions.filter(s => s.type === 'focus' && s.completed);
    
    const totalSessions = focusSessions.length;
    const totalFocusTime = focusSessions.reduce((total, session) => total + session.duration, 0);
    const totalInterruptions = focusSessions.reduce((total, session) => total + (session.interruptions || 0), 0);
    const averageSessionLength = totalSessions > 0 ? totalFocusTime / totalSessions : 0;
    
    return {
      totalSessions,
      totalFocusTime,
      totalInterruptions,
      averageSessionLength
    };
  } catch (error) {
    console.error('Error getting session stats:', error);
    return {
      totalSessions: 0,
      totalFocusTime: 0,
      totalInterruptions: 0,
      averageSessionLength: 0
    };
  }
};
