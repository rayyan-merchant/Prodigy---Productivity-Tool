
import React from 'react';
import { Plus, FileText, Target, Clock, CheckSquare, Flame } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

const QuickActionsPanel: React.FC = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "New Task",
      description: "Create a new task",
      icon: <CheckSquare className="h-5 w-5" />,
      action: () => navigate('/tasks'),
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "New Note",
      description: "Write a new note",
      icon: <FileText className="h-5 w-5" />,
      action: () => navigate('/notes'),
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Set Goal",
      description: "Create a new goal",
      icon: <Target className="h-5 w-5" />,
      action: () => navigate('/goals'),
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "New Habit",
      description: "Track a new habit",
      icon: <Flame className="h-5 w-5" />,
      action: () => navigate('/habits'),
      color: "bg-orange-500 hover:bg-orange-600"
    },
    {
      title: "Start Timer",
      description: "Begin a focus session",
      icon: <Clock className="h-5 w-5" />,
      action: () => navigate('/pomodoro'),
      color: "bg-red-500 hover:bg-red-600"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.slice(0, 4).map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-auto p-4 flex flex-col items-center gap-2 text-white border-0 ${action.color} transition-all duration-200 hover:scale-105`}
              onClick={action.action}
            >
              {action.icon}
              <div className="text-center">
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs opacity-90">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
        <div className="mt-3">
          <Button
            variant="outline"
            className="w-full h-auto p-4 flex flex-col items-center gap-2 text-white border-0 bg-red-500 hover:bg-red-600 transition-all duration-200 hover:scale-105"
            onClick={quickActions[4].action}
          >
            {quickActions[4].icon}
            <div className="text-center">
              <div className="font-medium text-sm">{quickActions[4].title}</div>
              <div className="text-xs opacity-90">{quickActions[4].description}</div>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsPanel;
