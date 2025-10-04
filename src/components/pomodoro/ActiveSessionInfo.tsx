
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface ActiveSessionInfoProps {
  focusType: string;
  customFocus: string;
  quickNote: string;
  setQuickNote: (note: string) => void;
}

const ActiveSessionInfo: React.FC<ActiveSessionInfoProps> = ({
  focusType,
  customFocus,
  quickNote,
  setQuickNote
}) => {
  const displayFocus = focusType === 'Custom' ? customFocus : focusType;
  
  return (
    <>
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Current Task</h3>
          </div>
          <div className="bg-white/5 p-3 rounded-md">
            <p className="text-lg font-medium">{displayFocus || 'Focus Session'}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Session Notes</h3>
          </div>
          <Textarea
            placeholder="Take notes during your focus session..."
            value={quickNote}
            onChange={(e) => setQuickNote(e.target.value)}
            className="min-h-[150px] bg-white/5 border-white/20 text-white placeholder:text-white/50"
          />
          <p className="text-xs mt-2 text-white/70">
            These notes will be saved automatically when you complete your session.
          </p>
        </CardContent>
      </Card>
    </>
  );
};

export default ActiveSessionInfo;
