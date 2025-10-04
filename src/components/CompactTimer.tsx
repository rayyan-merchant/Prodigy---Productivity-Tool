
import React from 'react';
import { Timer } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const CompactTimer = () => {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardContent className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Timer className="h-5 w-5 text-primary" />
          <div className="space-y-1">
            <h3 className="font-medium">Pomodoro Timer</h3>
            <p className="text-sm text-muted-foreground">Start a focused work session</p>
          </div>
        </div>
        <Button onClick={() => navigate('/pomodoro')} variant="outline" size="sm">
          Start Timer
        </Button>
      </CardContent>
    </Card>
  );
};

export default CompactTimer;
