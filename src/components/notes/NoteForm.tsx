
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wand } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

interface NoteFormProps {
  title: string;
  content: string;
  tags: string[];
  isGeneratingTitleAndTags: boolean;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onRemoveTag: (tag: string) => void;
  onAddTag: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onGenerateTitleAndTags: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({
  title,
  content,
  tags,
  isGeneratingTitleAndTags,
  onTitleChange,
  onContentChange,
  onRemoveTag,
  onAddTag,
  onGenerateTitleAndTags
}) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={onGenerateTitleAndTags}
            disabled={isGeneratingTitleAndTags || !content.trim()}
            className="h-8 text-xs"
          >
            <Wand className="h-3 w-3 mr-1" />
            {isGeneratingTitleAndTags ? 'Generating...' : 'Generate Title & Tags'}
          </Button>
        </div>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Note title"
          required
          autoFocus
        />
      </div>
      
      <div className="grid gap-2">
        <label htmlFor="content" className="text-sm font-medium">
          Content
        </label>
        <RichTextEditor
          value={content}
          onChange={onContentChange}
          placeholder="Write your note here..."
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="tags" className="text-sm font-medium">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map(tag => (
            <Badge key={tag} variant="secondary" className="px-3 py-1">
              {tag}
              <button 
                type="button" 
                onClick={() => onRemoveTag(tag)} 
                className="ml-2 hover:text-destructive focus:outline-none"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
        <Input
          id="tags"
          placeholder="Add tags (press Enter to add)"
          onKeyDown={onAddTag}
        />
      </div>
    </div>
  );
};

export default NoteForm;
