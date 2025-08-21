import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Mail,
  Calendar,
  Plus,
  Receipt,
  Clock,
  Video,
  Users,
  MoreHorizontal,
  Star,
  Reply,
  Forward,
  ChevronRight,
  Bell,
  ExternalLink,
  Send,
  MessageSquare,
} from "lucide-react";
import { QuickComposeModal } from "@/components/QuickComposeModal";
import { CalendarSchedulerModal } from "@/components/CalendarSchedulerModal";

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  start?: string;
  attendees: string[];
  meetLink?: string;
  location?: string;
}

interface EmailThread {
  id: string;
  from: string;
  subject: string;
  preview: string;
  time: string;
  starred: boolean;
  avatar?: string;
}

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Discovery call – Priya",
    time: "Today 10:30 AM - 11:00 AM",
    start: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    attendees: ["priya@example.com"],
    meetLink: "https://meet.google.com/xyz",
    location: "Google Meet",
  },
  {
    id: "2",
    title: "Team standup",
    time: "Tomorrow 2:00 PM - 2:30 PM",
    start: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(), // Tomorrow
    attendees: ["team@solai.com"],
    meetLink: "https://meet.google.com/abc",
  },
  {
    id: "3",
    title: "Client presentation",
    time: "Thu 4:00 PM - 5:00 PM",
    start: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    attendees: ["client@acme.com", "john@acme.com"],
  },
  {
    id: "4",
    title: "Monthly review meeting",
    time: "Next week Mon 9:00 AM - 10:00 AM",
    start: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    attendees: ["team@solai.com", "manager@solai.com"],
    meetLink: "https://meet.google.com/review",
  },
  {
    id: "5",
    title: "Quarterly planning session",
    time: "Feb 15 2:00 PM - 4:00 PM",
    start: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 3 weeks from now
    attendees: ["leadership@solai.com"],
    meetLink: "https://meet.google.com/planning",
  },
];

const mockEmails: EmailThread[] = [
  {
    id: "1",
    from: "Priya Chen",
    subject: "Re: Project proposal discussion",
    preview:
      "Thanks for the detailed proposal. I have a few questions about the timeline...",
    time: "2 hours ago",
    starred: true,
    avatar: "/placeholder.svg",
  },
  {
    id: "2",
    from: "John Smith",
    subject: "Invoice #1024 - Payment confirmation",
    preview:
      "Hi, I wanted to confirm that we received your invoice and payment is being processed...",
    time: "4 hours ago",
    starred: true,
  },
  {
    id: "3",
    from: "Sarah Wilson",
    subject: "Meeting follow-up",
    preview: "Great meeting today! Here are the action items we discussed...",
    time: "1 day ago",
    starred: true,
  },
];

export default function Dashboard() {
  const [isQuickComposeOpen, setIsQuickComposeOpen] = useState(false);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI assistant. How can I help you manage your business today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleEmailAttendees = (eventId: string) => {
    console.log("Email attendees for event:", eventId);
  };

  const handleSnoozeReminder = (eventId: string) => {
    console.log("Snooze reminder for event:", eventId);
  };

  const handleFollowUp = (emailId: string, days: number) => {
    console.log(`Follow up on email ${emailId} in ${days} days`);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: chatInput,
      isUser: true,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, newMessage]);
    setChatInput('');

    // TODO: Add LLM integration here later
    // For now, just simulate a response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Thanks for your message! LLM functionality will be added soon.',
        isUser: false,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <h1 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
                <span className="hidden sm:inline">SolAI Dashboard</span>
                <span className="sm:hidden">SolAI</span>
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="text-xs">IY</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 min-h-[calc(100vh-8rem)]">
          {/* Quick Actions - Mobile: Full width, Desktop: Left sidebar */}
          <div className="lg:col-span-3 order-1 lg:order-1">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start"
                  variant="default"
                  onClick={() => setIsQuickComposeOpen(true)}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Send Template Email
                </Button>

                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => setIsSchedulerOpen(true)}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Propose Times
                </Button>

                <Button className="w-full justify-start" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Button>

                <Button className="w-full justify-start" variant="outline">
                  <Receipt className="mr-2 h-4 w-4" />
                  Run Invoice Reminders
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Center Content - Mobile: Full width, Desktop: Main content */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6 overflow-y-auto order-3 lg:order-2">
            {/* Chat Section */}
            <Card className="h-[400px] sm:h-[500px] flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col min-h-0">
                {/* Chat Messages */}
                <ScrollArea className="flex-1 mb-4">
                  <div className="space-y-3">
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.isUser
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Chat Input */}
                <div className="flex space-x-2">
                  <Input
                    placeholder="Ask me anything..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Emails */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <Star className="mr-2 h-5 w-5" />
                  Recent Starred Emails
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockEmails.map((email) => (
                    <div
                      key={email.id}
                      className="p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={email.avatar} />
                              <AvatarFallback>
                                {email.from
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm">
                              {email.from}
                            </span>
                            <span className="text-xs text-slate-500">
                              {email.time}
                            </span>
                          </div>
                          <div className="font-medium text-sm mb-1">
                            {email.subject}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                            {email.preview}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-3">
                        <Button size="sm" variant="ghost" className="text-xs">
                          <Reply className="mr-1 h-3 w-3" />
                          Reply w/ Template
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs"
                          onClick={() => handleFollowUp(email.id, 2)}
                        >
                          Follow up in 2d
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs"
                          onClick={() => handleFollowUp(email.id, 5)}
                        >
                          5d
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Sidebar - Mobile: Full width, Desktop: Right sidebar */}
          <div className="lg:col-span-3 order-2 lg:order-3">
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col min-h-0">
                {/* Chat Messages */}
                <ScrollArea className="flex-1 mb-4">
                  <div className="space-y-3">
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.isUser
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Chat Input */}
                <div className="flex space-x-2">
                  <Input
                    placeholder="Ask me anything..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <QuickComposeModal
        open={isQuickComposeOpen}
        onOpenChange={setIsQuickComposeOpen}
      />

      <CalendarSchedulerModal
        open={isSchedulerOpen}
        onOpenChange={setIsSchedulerOpen}
      />
    </div>
  );
}
