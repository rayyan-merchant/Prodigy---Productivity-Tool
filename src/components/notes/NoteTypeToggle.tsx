
import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit, CheckSquare } from 'lucide-react';

interface NoteTypeToggleProps {
  isChecklist: boolean;
  onToggle: () => void;
}

const NoteTypeToggle: React.FC<NoteTypeToggleProps> = ({
  isChecklist,
  onToggle
}) => {
  return (
    <div className="flex items-center gap-2 pb-2 border-b">
      <Button
        variant={!isChecklist ? "default" : "outline"}
        size="sm"
        onClick={() => !isChecklist || onToggle()}
        className="flex items-center gap-2"
      >
        <Edit className="h-4 w-4" />
        Text Note
      </Button>
      <Button
        variant={isChecklist ? "default" : "outline"}
        size="sm"
        onClick={() => isChecklist || onToggle()}
        className="flex items-center gap-2"
      >
        <CheckSquare className="h-4 w-4" />
        Checklist
      </Button>
    </div>
  );
};

export default NoteTypeToggle;
