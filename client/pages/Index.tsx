import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
} from "lucide-react";
import { QuickComposeModal } from "@/components/QuickComposeModal";
import { CalendarSchedulerModal } from "@/components/CalendarSchedulerModal";

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
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

const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Discovery call – Priya",
    time: "10:30 AM - 11:00 AM",
    attendees: ["priya@example.com"],
    meetLink: "https://meet.google.com/xyz",
    location: "Google Meet",
  },
  {
    id: "2",
    title: "Team standup",
    time: "2:00 PM - 2:30 PM",
    attendees: ["team@solai.com"],
    meetLink: "https://meet.google.com/abc",
  },
  {
    id: "3",
    title: "Client presentation",
    time: "4:00 PM - 5:00 PM",
    attendees: ["client@acme.com", "john@acme.com"],
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

  const handleEmailAttendees = (eventId: string) => {
    console.log("Email attendees for event:", eventId);
  };

  const handleSnoozeReminder = (eventId: string) => {
    console.log("Snooze reminder for event:", eventId);
  };

  const handleFollowUp = (emailId: string, days: number) => {
    console.log(`Follow up on email ${emailId} in ${days} days`);
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
            {/* Today's Calendar */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Today - Next 6 Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {event.time}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {event.attendees.join(", ")}
                        </div>
                      </div>
                      {event.meetLink && (
                        <Button size="sm" variant="outline" className="ml-3">
                          <Video className="mr-1 h-3 w-3" />
                          Join
                        </Button>
                      )}
                    </div>
                  ))}
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

          {/* Notifications Sidebar - Mobile: Full width, Desktop: Right sidebar */}
          <div className="lg:col-span-3 order-2 lg:order-3">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Notifications</CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Next 72 hours
                </p>
              </CardHeader>
              <CardContent className="space-y-3 overflow-y-auto">
                {mockEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 border rounded-lg space-y-2"
                  >
                    <div className="text-sm font-medium">{event.title}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      {event.time}
                    </div>
                    <div className="space-y-1">
                      {event.meetLink && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full text-xs"
                        >
                          <Video className="mr-1 h-3 w-3" />
                          Join
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-full text-xs"
                        onClick={() => handleEmailAttendees(event.id)}
                      >
                        <Users className="mr-1 h-3 w-3" />
                        Email Attendees
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-full text-xs"
                        onClick={() => handleSnoozeReminder(event.id)}
                      >
                        <Clock className="mr-1 h-3 w-3" />
                        Snooze 15m
                      </Button>
                    </div>
                  </div>
                ))}
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
