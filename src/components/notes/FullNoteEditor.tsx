import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Note, ChecklistItemData } from '@/types/notes';
import { getNoteById, updateNote } from '@/services/noteService';
import { useToast } from '@/hooks/use-toast';
import { summarizeNote, askAIAboutNote, generateNoteTitleAndTags } from '@/services/supabaseAiService';
import { createNoteActivity } from '@/services/activityService';
import Checklist from './Checklist';
import NoteEditorHeader from './NoteEditorHeader';
import NoteTitleSection from './NoteTitleSection';
import NoteTypeToggle from './NoteTypeToggle';
import TextEditor from './TextEditor';
import AIFeaturesSidebar from './AIFeaturesSidebar';
import AISummaryDialog from './AISummaryDialog';
import AIAssistantDialog from './AIAssistantDialog';

const FullNoteEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isChecklist, setIsChecklist] = useState(false);
  const [checklistItems, setChecklistItems] = useState<ChecklistItemData[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // AI States
  const [summarizeLoading, setSummarizeLoading] = useState(false);
  const [askAILoading, setAskAILoading] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [summaryDialogOpen, setSummaryDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [copiedText, setCopiedText] = useState(false);
  const [summary, setSummary] = useState<{
    tldr: string;
    bullets: string[];
    formal: string;
  } | null>(null);
  
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const autoSaveTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      
      const fetchNote = async () => {
        try {
          const note = await getNoteById(id);
          setTitle(note.title);
          setContent(note.content);
          setTags(note.tags || []);
          setIsChecklist(note.isChecklist || false);
          setChecklistItems(note.checklistItems || []);
          setLastSaved(new Date(note.updatedAt));
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load note. Please try again.",
            variant: "destructive"
          });
          navigate('/notes');
        } finally {
          setLoading(false);
        }
      };
      
      fetchNote();
    } else {
      setLoading(false);
    }
  }, [id, navigate, toast]);

  // Calculate word count and reading time
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    setWordCount(words);
    setReadingTime(Math.ceil(words / 200));
  }, [content]);

  // Auto-save effect
  useEffect(() => {
    if (isDirty && id) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      
      autoSaveTimerRef.current = setTimeout(async () => {
        try {
          await updateNote(id, {
            title,
            content,
            tags,
            isChecklist,
            checklistItems
          });
          setIsDirty(false);
          setLastSaved(new Date());
        } catch (error) {
          console.error('Error auto-saving note:', error);
        }
      }, 3000);
    }
    
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [title, content, tags, isDirty, id]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setIsDirty(true);
  };

  const handleTitleChangeFromInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setIsDirty(true);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsDirty(true);
  };

  const handleChecklistChange = (items: ChecklistItemData[]) => {
    setChecklistItems(items);
    setIsDirty(true);
  };

  const toggleNoteType = () => {
    setIsChecklist(!isChecklist);
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      if (id) {
        await updateNote(id, {
          title,
          content,
          tags,
          isChecklist,
          checklistItems
        });
        
        setIsDirty(false);
        setLastSaved(new Date());
        
        // Create activity
        await createNoteActivity(
          'Note updated',
          `"${title}" was updated`,
          id
        );
        
        toast({
          title: "Note updated",
          description: "Your note has been updated successfully."
        });
      }
      
      navigate('/notes');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save note. Please try again.",
        variant: "destructive"
      });
    }
  };

  const insertFormatting = (formatType: string) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let formattedText = '';
    let cursorOffset = 0;
    
    switch (formatType) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        cursorOffset = 2;
        break;
      case 'italic':
        formattedText = `_${selectedText}_`;
        cursorOffset = 1;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        cursorOffset = 3;
        break;
      case 'list':
        if (selectedText.includes('\n')) {
          formattedText = selectedText
            .split('\n')
            .map(line => line.trim() ? `- ${line}` : line)
            .join('\n');
        } else {
          formattedText = `- ${selectedText}`;
        }
        cursorOffset = 2;
        break;
      default:
        return;
    }
    
    const newContent = 
      content.substring(0, start) + 
      formattedText + 
      content.substring(end);
    
    setContent(newContent);
    setIsDirty(true);
    
    setTimeout(() => {
      textarea.focus();
      if (selectedText.length === 0) {
        textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);
      } else {
        textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
      }
    }, 0);
  };

  const handleSummarize = async () => {
    if (!content.trim() && !checklistItems.length) {
      toast({
        title: "Error",
        description: "Add some content to summarize first",
        variant: "destructive"
      });
      return;
    }

    try {
      setSummarizeLoading(true);
      const result = await summarizeNote(content);
      setSummary(result);
      setSummaryDialogOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to summarize note. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSummarizeLoading(false);
    }
  };

  const handleAskAI = () => {
    if (!content.trim() && !checklistItems.length) {
      toast({
        title: "Error",
        description: "Add some content first before asking AI",
        variant: "destructive"
      });
      return;
    }
    
    setAiQuestion('');
    setAiResponse('');
    setAiDialogOpen(true);
  };

  const handleAskAISubmit = async () => {
    if (!aiQuestion.trim()) {
      toast({
        title: "Error",
        description: "Please enter a question",
        variant: "destructive"
      });
      return;
    }

    try {
      setAskAILoading(true);
      const result = await askAIAboutNote(content, aiQuestion);
      setAiResponse(result);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setAskAILoading(false);
    }
  };

  const handleGenerateTitleAndTags = async () => {
    if (!content.trim() && !checklistItems.length) {
      toast({
        title: "Error",
        description: "Please add some content to your note first",
        variant: "destructive"
      });
      return;
    }

    try {
      setGenerateLoading(true);
      
      const result = await generateNoteTitleAndTags(content);
      
      if (result.title) {
        setTitle(result.title);
        setIsDirty(true);
      }
      
      if (result.tags && result.tags.length > 0) {
        setTags(result.tags);
        setIsDirty(true);
      }
      
      toast({
        title: "AI Suggestions",
        description: "Generated title and tags based on your note content"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate title and tags. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGenerateLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
      toast({
        title: "Copied to clipboard",
        description: "Text has been copied to your clipboard"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
    setIsDirty(true);
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = (e.target as HTMLInputElement).value.trim();
      if (value && !tags.includes(value)) {
        setTags([...tags, value]);
        (e.target as HTMLInputElement).value = '';
        setIsDirty(true);
      }
    }
  };

  const renderMarkdown = (text: string): string => {
    let html = text
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-medium mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/_(.*?)_/g, '<em class="italic">$1</em>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/\n/g, '<br>');
    
    return html;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const hasContent = content.trim().length > 0 || checklistItems.length > 0;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <NoteEditorHeader
        title={title}
        onTitleChange={handleTitleChange}
        tags={tags}
        onTagAdd={addTag}
        onTagRemove={removeTag}
        onGenerateTitleAndTags={handleGenerateTitleAndTags}
        onSave={handleSave}
        generateLoading={generateLoading}
        wordCount={wordCount}
        readingTime={readingTime}
        isDirty={isDirty}
        lastSaved={lastSaved}
        isCreate={!id}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="p-6">
            <div className="space-y-4">
              <NoteTitleSection
                title={title}
                onTitleChange={handleTitleChangeFromInput}
                tags={tags}
                onTagAdd={addTag}
                onTagRemove={removeTag}
                onGenerateTitleAndTags={handleGenerateTitleAndTags}
                generateLoading={generateLoading}
                hasContent={hasContent}
              />

              <NoteTypeToggle
                isChecklist={isChecklist}
                onToggle={toggleNoteType}
              />

              {isChecklist ? (
                <div className="min-h-[500px]">
                  <Checklist
                    items={checklistItems}
                    onChange={handleChecklistChange}
                  />
                </div>
              ) : (
                <TextEditor
                  content={content}
                  onContentChange={handleContentChange}
                  onFormatting={insertFormatting}
                  onCopy={() => copyToClipboard(content)}
                  copiedText={copiedText}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  textareaRef={textareaRef}
                  renderMarkdown={renderMarkdown}
                />
              )}
            </div>
          </Card>
        </div>

        <AIFeaturesSidebar
          onSummarize={handleSummarize}
          onAskAI={handleAskAI}
          onGenerateTitleAndTags={handleGenerateTitleAndTags}
          onBackToNotes={() => navigate('/notes')}
          onCopyContent={() => copyToClipboard(content)}
          summarizeLoading={summarizeLoading}
          askAILoading={askAILoading}
          generateLoading={generateLoading}
          copiedText={copiedText}
          hasContent={hasContent}
        />
      </div>

      <AISummaryDialog
        open={summaryDialogOpen}
        onOpenChange={setSummaryDialogOpen}
        summary={summary}
      />

      <AIAssistantDialog
        open={aiDialogOpen}
        onOpenChange={setAiDialogOpen}
        question={aiQuestion}
        onQuestionChange={setAiQuestion}
        response={aiResponse}
        loading={askAILoading}
        onSubmit={handleAskAISubmit}
        onCopyResponse={() => copyToClipboard(aiResponse)}
      />
    </div>
  );
};

export default FullNoteEditor;
