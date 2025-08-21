import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Reply, Star } from 'lucide-react';

interface RecentEmailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
  {
    id: "4",
    from: "Mike Johnson",
    subject: "Design feedback",
    preview: "I've reviewed the latest designs and have some suggestions...",
    time: "2 days ago",
    starred: true,
  },
  {
    id: "5",
    from: "Lisa Wang",
    subject: "Budget approval request",
    preview: "Could you please review and approve the Q1 budget proposal...",
    time: "3 days ago",
    starred: true,
  },
];

export function RecentEmailsModal({ open, onOpenChange }: RecentEmailsModalProps) {
  const handleFollowUp = (emailId: string, days: number) => {
    console.log(`Follow up on email ${emailId} in ${days} days`);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-0 w-[calc(100vw-2rem)] sm:w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Star className="mr-2 h-5 w-5" />
            Recent Starred Emails
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh]">
          <div className="space-y-3">
            {mockEmails.map((email) => (
              <div
                key={email.id}
                className="p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={email.avatar} />
                        <AvatarFallback>
                          {email.from
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{email.from}</span>
                          <span className="text-xs text-slate-500">{email.time}</span>
                        </div>
                        <div className="font-medium text-sm text-slate-900 dark:text-slate-100 mt-1">
                          {email.subject}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      {email.preview}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
