
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Lightbulb, Copy } from 'lucide-react';

interface AIAssistantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: string;
  onQuestionChange: (value: string) => void;
  response: string;
  loading: boolean;
  onSubmit: () => void;
  onCopyResponse: () => void;
}

const AIAssistantDialog: React.FC<AIAssistantDialogProps> = ({
  open,
  onOpenChange,
  question,
  onQuestionChange,
  response,
  loading,
  onSubmit,
  onCopyResponse
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            AI Assistant
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex gap-2">
            <Input
              value={question}
              onChange={(e) => onQuestionChange(e.target.value)}
              placeholder="Ask a question about your note..."
              disabled={loading}
              className="flex-1"
            />
            <Button 
              onClick={onSubmit}
              disabled={loading || !question.trim()}
            >
              {loading ? "Processing..." : "Ask"}
            </Button>
          </div>
          
          {response && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                AI Response:
              </h4>
              <div className="bg-muted p-4 rounded text-sm whitespace-pre-line max-h-[300px] overflow-y-auto border-l-4 border-blue-500">
                {response}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onCopyResponse}
                className="mt-2"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy Response
              </Button>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIAssistantDialog;
