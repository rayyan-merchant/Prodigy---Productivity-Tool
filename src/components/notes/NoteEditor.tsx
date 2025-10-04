import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Note } from '@/types/notes';
import { generateNoteTitleAndTags } from '@/services/aiService';
import { useToast } from '@/components/ui/use-toast';
import NoteForm from './NoteForm';

interface NoteEditorProps {
  isOpen: boolean;
  note: Note | null;
  onClose: () => void;
  onSave: (note: Note) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ isOpen, note, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isGeneratingTitleAndTags, setIsGeneratingTitleAndTags] = useState(false);
  const { toast } = useToast();

  // Reset form when a new note is loaded or created
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags || []);
    } else {
      setTitle('');
      setContent('');
      setTags([]);
    }
  }, [note, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedNote: Note = {
      id: note?.id || '',
      title: title.trim(),
      content: content.trim(),
      createdAt: note?.createdAt || '',
      updatedAt: new Date().toISOString(),
      tags: tags,
      isFavorite: note?.isFavorite || false,
      isEncrypted: note?.isEncrypted || false,
      isLocked: note?.isLocked || false,
      lockPasswordHash: note?.lockPasswordHash,
      lockSalt: note?.lockSalt,
      folderId: note?.folderId,
      encryptedContent: note?.encryptedContent,
      passwordHash: note?.passwordHash,
      salt: note?.salt,
      isChecklist: note?.isChecklist,
      checklistItems: note?.checklistItems,
    };
    
    onSave(updatedNote);
  };

  const handleGenerateTitleAndTags = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please add some content to your note first",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsGeneratingTitleAndTags(true);
      
      const result = await generateNoteTitleAndTags(content);
      
      if (result.title) {
        setTitle(result.title);
      }
      
      if (result.tags && result.tags.length > 0) {
        setTags(result.tags);
      }
      
      toast({
        title: "AI Suggestions",
        description: "Generated title and tags based on your note content"
      });
    } catch (error) {
      console.error("Error generating title and tags:", error);
      toast({
        title: "Error",
        description: "Failed to generate title and tags. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingTitleAndTags(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = (e.target as HTMLInputElement).value.trim();
      if (value && !tags.includes(value)) {
        setTags([...tags, value]);
        (e.target as HTMLInputElement).value = '';
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{note ? 'Edit Note' : 'Create Note'}</DialogTitle>
          </DialogHeader>
          
          <NoteForm
            title={title}
            content={content}
            tags={tags}
            isGeneratingTitleAndTags={isGeneratingTitleAndTags}
            onTitleChange={setTitle}
            onContentChange={setContent}
            onRemoveTag={removeTag}
            onAddTag={addTag}
            onGenerateTitleAndTags={handleGenerateTitleAndTags}
          />
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NoteEditor;
