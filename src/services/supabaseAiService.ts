
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Task } from '@/types/tasks';

interface AIResponse {
  success: boolean;
  data: any;
  error?: string;
}

const callSupabaseAI = async (
  prompt: string, 
  type: string, 
  context?: any, 
  maxTokens: number = 1000
): Promise<any> => {
  try {
    console.log(`Calling Supabase AI service for type: ${type}`)
    
    const { data, error } = await supabase.functions.invoke('ai-service', {
      body: {
        prompt,
        type,
        context,
        maxTokens
      }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(error.message || 'AI service error');
    }

    const response = data as AIResponse;
    
    if (!response.success) {
      throw new Error(response.error || 'AI service returned an error');
    }

    return response.data;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    console.error('AI service error:', err);
    toast.error(`AI service error: ${errorMessage}`);
    return 'Sorry, I encountered an error processing your request. Please try again later.';
  }
};

/**
 * Get AI-generated productivity tips
 */
export const getProductivityTips = async (): Promise<string> => {
  const prompt = `Give me 3 actionable productivity tips for today. Format them as a numbered list.
  Each tip should be concise (15-20 words max) and immediately actionable.
  Make them practical for someone working on a project or studying.`;
  
  return callSupabaseAI(prompt, 'productivity-tips');
};

/**
 * Get a motivational quote
 */
export const getMotivationalQuote = async (): Promise<string> => {
  const prompt = `Generate an inspiring motivational quote about productivity, focus, or achievement.
  Keep it short (under 100 characters if possible) and impactful.
  Don't attribute it to anyone specific unless it's a very famous quote.`;
  
  return callSupabaseAI(prompt, 'motivational-quote');
};

/**
 * Analyze task priorities
 */
export const analyzeTaskPriorities = async (tasks: string[]): Promise<string> => {
  if (!tasks || tasks.length === 0) {
    return "No tasks to analyze.";
  }
  
  const taskList = tasks.join("\n- ");
  const prompt = `I have the following tasks to work on today:
  - ${taskList}
  
  Based on productivity best practices, suggest which 2-3 tasks I should focus on first and briefly explain why.
  Keep your response concise (max 100 words).`;
  
  return callSupabaseAI(prompt, 'analyze-priorities', { tasks });
};

/**
 * Summarize notes
 */
export const summarizeNotes = async (notes: string): Promise<string> => {
  if (!notes || notes.length < 50) {
    return "Text is too short to summarize.";
  }
  
  const prompt = `Summarize the following notes in 3-5 key points:
  
  ${notes.substring(0, 2000)} ${notes.length > 2000 ? '...(truncated)' : ''}
  
  Format each key point as a bullet point.`;
  
  return callSupabaseAI(prompt, 'summarize-notes', { notes });
};

/**
 * Ask AI questions about a note
 */
export const askAIAboutNote = async (note: string, question: string): Promise<string> => {
  if (!note || note.length < 20) {
    return "The note is too short to analyze.";
  }

  if (!question || question.length < 3) {
    return "Please ask a more specific question.";
  }

  const prompt = `Given the following note content:
  
  "${note.substring(0, 2000)} ${note.length > 2000 ? '...(truncated)' : ''}"
  
  ${question}
  
  Please provide a helpful response.`;

  return callSupabaseAI(prompt, 'ask-about-note', { note, question });
};

/**
 * Summarize a specific note
 */
export const summarizeNote = async (note: string): Promise<{
  tldr: string;
  bullets: string[];
  formal: string;
}> => {
  if (!note || note.length < 50) {
    return {
      tldr: "Text is too short to summarize.",
      bullets: ["No significant content to summarize"],
      formal: "Insufficient content for formal summary."
    };
  }
  
  const prompt = `Summarize the following note in three different ways:
  1. A one-sentence TL;DR (max 20 words)
  2. 3-5 key bullet points (each 10-15 words)
  3. A formal paragraph summary (max 75 words)
  
  Note content:
  ${note.substring(0, 2000)} ${note.length > 2000 ? '...(truncated)' : ''}
  
  Format your response exactly in this structure (including the JSON):
  {
    "tldr": "One sentence summary here",
    "bullets": ["Bullet 1", "Bullet 2", "Bullet 3"],
    "formal": "Formal paragraph summary here"
  }`;

  try {
    const response = await callSupabaseAI(prompt, 'summarize-note', { note });
    return response;
  } catch (error) {
    console.error("Error summarizing note:", error);
    return {
      tldr: "Error generating summary",
      bullets: ["An error occurred while summarizing your note"],
      formal: "Could not generate a formal summary due to an error."
    };
  }
};

/**
 * Generate weekly insights based on user productivity data
 */
export const generateWeeklyInsights = async (data: {
  completedTasks: number;
  focusHours: number;
  sessionsCompleted: number;
}): Promise<string> => {
  const prompt = `Based on the following weekly productivity data:
  
  - Tasks Completed: ${data.completedTasks}
  - Focus Hours: ${data.focusHours}
  - Pomodoro Sessions: ${data.sessionsCompleted}
  
  Please provide a brief, personalized insight about my productivity this week with one tip for improvement.
  Keep your response concise (50-80 words).`;

  return callSupabaseAI(prompt, 'weekly-insights', data);
};

/**
 * Generate title and tags for a note based on content
 */
export const generateNoteTitleAndTags = async (content: string): Promise<{ title: string; tags: string[] }> => {
  if (!content || content.length < 30) {
    return { title: "", tags: [] };
  }

  const prompt = `For the following note content, suggest:
  1. A concise title (max 5 words)
  2. 2-5 relevant tags (single words or short phrases)
  
  Content:
  "${content.substring(0, 1000)} ${content.length > 1000 ? '...(truncated)' : ''}"
  
  Format your response exactly like this (including the JSON structure):
  {"title": "Suggested Title", "tags": ["tag1", "tag2", "tag3"]}`;

  try {
    const response = await callSupabaseAI(prompt, 'generate-title-tags', { content });
    return response;
  } catch (error) {
    console.error("Error generating title and tags:", error);
    return { title: "", tags: [] };
  }
};

/**
 * Prioritize tasks using AI
 */
export const prioritizeTasks = async (tasks: Task[]): Promise<string[]> => {
  if (!tasks || tasks.length === 0) {
    return [];
  }

  const taskDetails = tasks.map(task => 
    `Task ID: ${task.id}
    Title: ${task.title}
    Description: ${task.description}
    Priority: ${task.priority}
    Due Date: ${task.dueDate || 'Not set'}
    Status: ${task.status}`
  ).join("\n\n");

  const prompt = `Based on the following tasks, prioritize them in order of importance and urgency:
  
  ${taskDetails}
  
  Return only a list of task IDs in priority order, from most important to least important.
  Format your response as a JSON array like this: ["task-id-1", "task-id-2", "task-id-3"]`;
  
  try {
    const response = await callSupabaseAI(prompt, 'prioritize-tasks', { tasks });
    return response;
  } catch (error) {
    console.error("Error parsing AI task priorities:", error);
    return [];
  }
};
