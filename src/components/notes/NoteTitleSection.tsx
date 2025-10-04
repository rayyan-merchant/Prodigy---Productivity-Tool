
import React from 'react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles } from 'lucide-react';

interface NoteTitleSectionProps {
  title: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  tags: string[];
  onTagAdd: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onTagRemove: (tag: string) => void;
  onGenerateTitleAndTags: () => void;
  generateLoading: boolean;
  hasContent: boolean;
}

const NoteTitleSection: React.FC<NoteTitleSectionProps> = ({
  title,
  onTitleChange,
  tags,
  onTagAdd,
  onTagRemove,
  onGenerateTitleAndTags,
  generateLoading,
  hasContent
}) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Note title"
          value={title}
          onChange={onTitleChange}
          className="text-2xl font-semibold flex-1"
        />
        <Button 
          variant="outline"
          onClick={onGenerateTitleAndTags}
          disabled={generateLoading || !hasContent}
          className="flex items-center gap-2"
        >
          <Sparkles className="h-4 w-4" />
          {generateLoading ? 'Generating...' : 'AI Generate'}
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <Badge key={tag} variant="secondary" className="px-3 py-1">
              {tag}
              <button 
                type="button" 
                onClick={() => onTagRemove(tag)} 
                className="ml-2 hover:text-destructive focus:outline-none"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
        <Input
          placeholder="Add tags (press Enter to add)"
          onKeyDown={onTagAdd}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default NoteTitleSection;
