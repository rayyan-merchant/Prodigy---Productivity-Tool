
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Wand, 
  FileText, 
  MessageSquare, 
  Lightbulb,
  Search,
  BookOpen,
  Copy,
  Check
} from 'lucide-react';

interface AIFeaturesSidebarProps {
  onSummarize: () => void;
  onAskAI: () => void;
  onGenerateTitleAndTags: () => void;
  onBackToNotes: () => void;
  onCopyContent: () => void;
  summarizeLoading: boolean;
  askAILoading: boolean;
  generateLoading: boolean;
  copiedText: boolean;
  hasContent: boolean;
}

const AIFeaturesSidebar: React.FC<AIFeaturesSidebarProps> = ({
  onSummarize,
  onAskAI,
  onGenerateTitleAndTags,
  onBackToNotes,
  onCopyContent,
  summarizeLoading,
  askAILoading,
  generateLoading,
  copiedText,
  hasContent
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <div className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Wand className="h-5 w-5" />
            AI Features
          </h3>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={onSummarize}
              disabled={summarizeLoading || !hasContent}
            >
              <FileText className="h-4 w-4 mr-2" />
              {summarizeLoading ? "Summarizing..." : "Summarize"}
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={onAskAI}
              disabled={askAILoading || !hasContent}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={onGenerateTitleAndTags}
              disabled={generateLoading || !hasContent}
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              {generateLoading ? "Generating..." : "Generate Title"}
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Search className="h-5 w-5" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={onBackToNotes}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Back to Notes
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={onCopyContent}
            >
              {copiedText ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copiedText ? 'Copied!' : 'Copy Content'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIFeaturesSidebar;
