
import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Quote, Code, Link } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your note here...",
  className = ""
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const insertFormatting = (formatType: string) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let formattedText = '';
    let cursorOffset = 0;
    
    switch (formatType) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        cursorOffset = 2;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        cursorOffset = 1;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        cursorOffset = 3;
        break;
      case 'code':
        formattedText = `\`${selectedText}\``;
        cursorOffset = 1;
        break;
      case 'quote':
        formattedText = `> ${selectedText}`;
        cursorOffset = 2;
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
      case 'numbered-list':
        if (selectedText.includes('\n')) {
          formattedText = selectedText
            .split('\n')
            .map((line, index) => line.trim() ? `${index + 1}. ${line}` : line)
            .join('\n');
        } else {
          formattedText = `1. ${selectedText}`;
        }
        cursorOffset = 3;
        break;
      case 'link':
        formattedText = `[${selectedText || 'link text'}](url)`;
        cursorOffset = selectedText ? formattedText.length - 4 : 1;
        break;
      default:
        return;
    }
    
    const newValue = 
      value.substring(0, start) + 
      formattedText + 
      value.substring(end);
    
    onChange(newValue);
    
    // Set cursor position after the insertion
    setTimeout(() => {
      textarea.focus();
      if (selectedText.length === 0) {
        textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);
      } else {
        textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
      }
    }, 0);
  };

  return (
    <div className={`border rounded-md ${className}`}>
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/50">
        <Button 
          type="button"
          variant="ghost" 
          size="sm"
          onClick={() => insertFormatting('bold')}
          className="h-8 w-8 p-0"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          type="button"
          variant="ghost" 
          size="sm"
          onClick={() => insertFormatting('italic')}
          className="h-8 w-8 p-0"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button 
          type="button"
          variant="ghost" 
          size="sm"
          onClick={() => insertFormatting('underline')}
          className="h-8 w-8 p-0"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button 
          type="button"
          variant="ghost" 
          size="sm"
          onClick={() => insertFormatting('code')}
          className="h-8 w-8 p-0"
        >
          <Code className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border my-1" />
        <Button 
          type="button"
          variant="ghost" 
          size="sm"
          onClick={() => insertFormatting('list')}
          className="h-8 w-8 p-0"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button 
          type="button"
          variant="ghost" 
          size="sm"
          onClick={() => insertFormatting('numbered-list')}
          className="h-8 w-8 p-0"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button 
          type="button"
          variant="ghost" 
          size="sm"
          onClick={() => insertFormatting('quote')}
          className="h-8 w-8 p-0"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button 
          type="button"
          variant="ghost" 
          size="sm"
          onClick={() => insertFormatting('link')}
          className="h-8 w-8 p-0"
        >
          <Link className="h-4 w-4" />
        </Button>
      </div>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border-0 focus-visible:ring-0 min-h-[200px] resize-none"
      />
    </div>
  );
};

export default RichTextEditor;
