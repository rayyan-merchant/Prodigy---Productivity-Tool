
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Save, Clock, Sparkles } from 'lucide-react';

interface NoteEditorHeaderProps {
  title: string;
  onTitleChange: (value: string) => void;
  tags: string[];
  onTagAdd: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onTagRemove: (tag: string) => void;
  onGenerateTitleAndTags: () => void;
  onSave: () => void;
  generateLoading: boolean;
  wordCount: number;
  readingTime: number;
  isDirty: boolean;
  lastSaved: Date | null;
  isCreate: boolean;
}

const NoteEditorHeader: React.FC<NoteEditorHeaderProps> = ({
  title,
  onTitleChange,
  tags,
  onTagAdd,
  onTagRemove,
  onGenerateTitleAndTags,
  onSave,
  generateLoading,
  wordCount,
  readingTime,
  isDirty,
  lastSaved,
  isCreate
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isCreate ? 'Create Note' : 'Edit Note'}
        </h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
          <span>{wordCount} words</span>
          <span>{readingTime} min read</span>
          {lastSaved && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {isDirty ? "Unsaved changes" : `Saved ${lastSaved.toLocaleTimeString()}`}
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={onSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save & Exit
        </Button>
      </div>
    </div>
  );
};

export default NoteEditorHeader;
