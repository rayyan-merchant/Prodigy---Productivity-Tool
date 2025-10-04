
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Users, 
  Plus, 
  Search, 
  Crown,
  Timer,
  Play,
  Pause,
  UserCheck,
  MessageCircle,
  Settings,
  Share2,
  Copy,
  CheckCircle
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { toast } from 'sonner';

interface TeamSessionsProps {
  isOpen: boolean;
  onClose: () => void;
}

const TeamSessions: React.FC<TeamSessionsProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  // Mock data for demonstration
  const publicSessions = [
    {
      id: '1',
      name: 'Study Group - Web Development',
      host: 'Alice Johnson',
      participants: 12,
      maxParticipants: 15,
      status: 'active',
      currentPhase: 'focus',
      timeRemaining: '18:45',
      tags: ['study', 'webdev', 'javascript'],
      description: 'Join us for focused coding sessions with 25min intervals'
    },
    {
      id: '2',
      name: 'Writing Marathon',
      host: 'Bob Smith',
      participants: 8,
      maxParticipants: 20,
      status: 'break',
      currentPhase: 'short-break',
      timeRemaining: '4:22',
      tags: ['writing', 'productivity', 'creative'],
      description: 'Writers working together in focused sprints'
    },
    {
      id: '3',
      name: 'Design Sprint Session',
      host: 'Carol Davis',
      participants: 6,
      maxParticipants: 10,
      status: 'waiting',
      currentPhase: 'waiting',
      timeRemaining: null,
      tags: ['design', 'ui/ux', 'figma'],
      description: 'Collaborative design work with structured breaks'
    }
  ];

  const myTeams = [
    {
      id: 'team1',
      name: 'Frontend Dev Team',
      members: ['John', 'Sarah', 'Mike', 'Lisa'],
      lastActive: '2 hours ago',
      totalSessions: 47
    },
    {
      id: 'team2',
      name: 'Study Buddies',
      members: ['Emma', 'David', 'Sophie'],
      lastActive: '1 day ago',
      totalSessions: 23
    }
  ];

  const filteredSessions = publicSessions.filter(session =>
    session.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleJoinSession = (sessionId: string) => {
    setSelectedSession(sessionId);
    toast.success('Joined session successfully!');
  };

  const handleCreateTeam = () => {
    toast.success('Team creation feature coming soon!');
  };

  const handleInviteMembers = () => {
    toast.success('Invite link copied to clipboard!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'break': return 'bg-yellow-500';
      case 'waiting': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPhaseText = (phase: string) => {
    switch (phase) {
      case 'focus': return 'Focus Session';
      case 'short-break': return 'Short Break';
      case 'long-break': return 'Long Break';
      case 'waiting': return 'Waiting to Start';
      default: return 'Unknown';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-4xl max-h-[80vh] ${theme === 'dark' ? 'bg-gray-900 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-200'}`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Pomodoro Sessions
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">Browse Sessions</TabsTrigger>
            <TabsTrigger value="teams">My Teams</TabsTrigger>
            <TabsTrigger value="create">Create Session</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="mt-4">
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search sessions or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {filteredSessions.map((session) => (
                    <Card key={session.id} className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg">{session.name}</h3>
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(session.status)}`} />
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Hosted by {session.host}
                            </p>
                            <p className="text-sm">{session.description}</p>
                          </div>
                          
                          <div className="text-right">
                            {session.timeRemaining && (
                              <div className="flex items-center gap-1 text-sm font-mono mb-1">
                                <Timer className="h-3 w-3" />
                                {session.timeRemaining}
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground">
                              {session.participants}/{session.maxParticipants} members
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex gap-1">
                            {session.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <Badge variant="outline" className="text-xs">
                              {getPhaseText(session.currentPhase)}
                            </Badge>
                            <Button
                              size="sm"
                              onClick={() => handleJoinSession(session.id)}
                              disabled={session.participants >= session.maxParticipants}
                            >
                              {session.participants >= session.maxParticipants ? 'Full' : 'Join'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="teams" className="mt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Your Teams</h3>
                <Button onClick={handleCreateTeam}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Team
                </Button>
              </div>

              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {myTeams.map((team) => (
                    <Card key={team.id} className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold flex items-center gap-2">
                              <Crown className="h-4 w-4 text-yellow-500" />
                              {team.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {team.members.length} members • Last active {team.lastActive}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {team.totalSessions} sessions
                          </Badge>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex -space-x-2">
                            {team.members.slice(0, 4).map((member, index) => (
                              <Avatar key={index} className="h-6 w-6 border-2 border-background">
                                <AvatarFallback className="text-xs">
                                  {member.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {team.members.length > 4 && (
                              <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                                +{team.members.length - 4}
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <MessageCircle className="h-3 w-3 mr-1" />
                              Chat
                            </Button>
                            <Button size="sm">
                              <Play className="h-3 w-3 mr-1" />
                              Start Session
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="create" className="mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className={`cursor-pointer hover:ring-2 hover:ring-primary ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <CardContent className="p-6 text-center">
                    <Users className="h-8 w-8 mx-auto mb-3 text-primary" />
                    <h3 className="font-semibold mb-2">Public Session</h3>
                    <p className="text-sm text-muted-foreground">
                      Create an open session that anyone can join
                    </p>
                  </CardContent>
                </Card>

                <Card className={`cursor-pointer hover:ring-2 hover:ring-primary ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <CardContent className="p-6 text-center">
                    <Crown className="h-8 w-8 mx-auto mb-3 text-yellow-500" />
                    <h3 className="font-semibold mb-2">Private Team</h3>
                    <p className="text-sm text-muted-foreground">
                      Invite-only session for your team members
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={handleInviteMembers}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Invite Link
                  </Button>
                  <Button variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Session Code
                  </Button>
                  <Button variant="outline">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Invite by Email
                  </Button>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Session Settings
                  </Button>
                </div>
              </div>

              <Card className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-blue-900 dark:text-blue-100">
                        Pro Tip: Team Sessions
                      </h5>
                      <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                        Team sessions help maintain group focus and accountability. 
                        Everyone follows the same timer, and you can see who's actively participating.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TeamSessions;
