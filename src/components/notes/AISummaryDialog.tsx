
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from 'lucide-react';

interface AISummaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  summary: {
    tldr: string;
    bullets: string[];
    formal: string;
  } | null;
}

const AISummaryDialog: React.FC<AISummaryDialogProps> = ({
  open,
  onOpenChange,
  summary
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>AI Note Summary</DialogTitle>
        </DialogHeader>
        
        {summary && (
          <div className="space-y-4 py-4 max-h-[500px] overflow-y-auto">
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                TL;DR
              </h4>
              <div className="bg-muted p-3 rounded border-l-4 border-primary">
                <p className="text-sm">{summary.tldr}</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-2">Key Points</h4>
              <ul className="list-disc pl-5 space-y-1 bg-muted/50 p-3 rounded">
                {summary.bullets.map((bullet, index) => (
                  <li key={index} className="text-sm">{bullet}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-2">Formal Summary</h4>
              <div className="bg-muted p-3 rounded">
                <p className="text-sm">{summary.formal}</p>
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AISummaryDialog;
