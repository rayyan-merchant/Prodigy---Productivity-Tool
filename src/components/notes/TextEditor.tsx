
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bold, 
  Italic, 
  Underline, 
  ListOrdered, 
  Copy,
  Check,
  Eye,
  Edit
} from 'lucide-react';

interface TextEditorProps {
  content: string;
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFormatting: (type: string) => void;
  onCopy: () => void;
  copiedText: boolean;
  activeTab: string;
  onTabChange: (value: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  renderMarkdown: (text: string) => string;
}

const TextEditor: React.FC<TextEditorProps> = ({
  content,
  onContentChange,
  onFormatting,
  onCopy,
  copiedText,
  activeTab,
  onTabChange,
  textareaRef,
  renderMarkdown
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="edit" className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Edit
        </TabsTrigger>
        <TabsTrigger value="preview" className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Preview
        </TabsTrigger>
      </TabsList>

      <TabsContent value="edit" className="space-y-4">
        <div className="flex gap-2 border-b pb-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onFormatting('bold')}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onFormatting('italic')}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onFormatting('underline')}
          >
            <Underline className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onFormatting('list')}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <div className="border-l mx-2" />
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onCopy}
            className="flex items-center gap-2"
          >
            {copiedText ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copiedText ? 'Copied!' : 'Copy'}
          </Button>
        </div>

        <Textarea
          placeholder="Write your note here..."
          value={content}
          onChange={onContentChange}
          className="min-h-[500px] text-base leading-relaxed"
          ref={textareaRef}
        />
      </TabsContent>

      <TabsContent value="preview">
        <div 
          className="min-h-[500px] border rounded-md p-4 overflow-auto prose prose-sm max-w-none" 
          dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
        />
      </TabsContent>
    </Tabs>
  );
};

export default TextEditor;
