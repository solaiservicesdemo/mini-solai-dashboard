import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Calendar, Clock, Send, Users } from "lucide-react";

interface CalendarSchedulerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TimeSlot {
  id: string;
  start: string;
  end: string;
  formatted: string;
}

const durationOptions = [
  { value: "15", label: "15 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "1 hour" },
  { value: "90", label: "1.5 hours" },
  { value: "120", label: "2 hours" },
];

const timeRangeOptions = [
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "this_week", label: "This week" },
  { value: "next_week", label: "Next week" },
  { value: "custom", label: "Custom range" },
];

// Mock suggested time slots (these would normally come from your n8n flow)
const mockSuggestedSlots: TimeSlot[] = [
  {
    id: "1",
    start: "2025-01-21T10:30:00-05:00",
    end: "2025-01-21T11:00:00-05:00",
    formatted: "Wed Jan 21, 10:30–11:00 AM ET",
  },
  {
    id: "2",
    start: "2025-01-21T14:00:00-05:00",
    end: "2025-01-21T14:30:00-05:00",
    formatted: "Wed Jan 21, 2:00–2:30 PM ET",
  },
  {
    id: "3",
    start: "2025-01-22T09:45:00-05:00",
    end: "2025-01-22T10:15:00-05:00",
    formatted: "Thu Jan 22, 9:45–10:15 AM ET",
  },
];

export function CalendarSchedulerModal({
  open,
  onOpenChange,
}: CalendarSchedulerModalProps) {
  const [to, setTo] = useState("");
  const [duration, setDuration] = useState("30");
  const [timeRange, setTimeRange] = useState("this_week");
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingNotes, setMeetingNotes] = useState("");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [suggestedSlots, setSuggestedSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"compose" | "review">("compose");

  const handleGenerateSlots = async () => {
    if (!to || !meetingTitle) return;

    setIsLoading(true);

    try {
      // This would typically call your n8n webhook to generate time slots
      const requestData = {
        to,
        durationMins: parseInt(duration),
        timeRange,
        customStartDate,
        customEndDate,
        title: meetingTitle,
        notes: meetingNotes,
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuggestedSlots(mockSuggestedSlots);
      setStep("review");
    } catch (error) {
      console.error("Failed to generate time slots:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendProposal = async () => {
    setIsLoading(true);

    try {
      const proposalData = {
        to,
        meetingTitle,
        meetingNotes,
        suggestedSlots,
        duration: parseInt(duration),
      };

      // This would call your n8n webhook to send the email proposal
      const response = await fetch("/api/propose-times", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(proposalData),
      });

      if (response.ok) {
        handleClose();
      }
    } catch (error) {
      console.error("Failed to send proposal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTo("");
    setDuration("30");
    setTimeRange("this_week");
    setMeetingTitle("");
    setMeetingNotes("");
    setCustomStartDate("");
    setCustomEndDate("");
    setSuggestedSlots([]);
    setStep("compose");
    onOpenChange(false);
  };

  const handleBack = () => {
    setStep("compose");
    setSuggestedSlots([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-0 w-[calc(100vw-2rem)] sm:w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Calendar Auto-Scheduler
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

        {step === "compose" && (
          <div className="space-y-6">
            {/* Recipient */}
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Email</Label>
              <Input
                id="recipient"
                type="email"
                placeholder="client@example.com"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>

            {/* Meeting Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Meeting Title</Label>
              <Input
                id="title"
                placeholder="Discovery call with SolAI"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label>Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {durationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Time Range */}
            <div className="space-y-2">
              <Label>Preferred Time Window</Label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeRangeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Custom Date Range */}
            {timeRange === "custom" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Meeting Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Meeting Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="We'll walk you through the mini dashboard and discuss your automation needs."
                value={meetingNotes}
                onChange={(e) => setMeetingNotes(e.target.value)}
                rows={3}
              />
            </div>

            {/* Working Hours Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <div className="text-sm">
                <strong>Working Hours:</strong> Mon–Fri, 9:30 AM – 5:30 PM ET
                <br />
                <strong>Buffer:</strong> 15 minutes between meetings
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleGenerateSlots}
                disabled={!to || !meetingTitle || isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>Generating...</>
                ) : (
                  <>
                    <Clock className="mr-2 h-4 w-4" />
                    Generate Time Slots
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {step === "review" && (
          <div className="space-y-6">
            {/* Meeting Summary */}
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg space-y-2">
              <div>
                <strong>Meeting:</strong> {meetingTitle}
              </div>
              <div>
                <strong>Recipient:</strong> {to}
              </div>
              <div>
                <strong>Duration:</strong> {duration} minutes
              </div>
              {meetingNotes && (
                <div>
                  <strong>Notes:</strong> {meetingNotes}
                </div>
              )}
            </div>

            {/* Suggested Time Slots */}
            <div className="space-y-3">
              <Label>Suggested Time Slots</Label>
              <div className="space-y-2">
                {suggestedSlots.map((slot, index) => (
                  <div
                    key={slot.id}
                    className="flex items-center p-3 border rounded-lg"
                  >
                    <Badge variant="outline" className="mr-3">
                      Option {index + 1}
                    </Badge>
                    <span className="font-medium">{slot.formatted}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Email Preview */}
            <div className="space-y-2">
              <Label>Email Preview</Label>
              <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-800 space-y-3">
                <div>
                  <Label className="text-xs text-slate-600 dark:text-slate-400">
                    Subject:
                  </Label>
                  <div className="font-medium">
                    Meeting invitation: {meetingTitle}
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-slate-600 dark:text-slate-400">
                    Body:
                  </Label>
                  <div className="whitespace-pre-wrap text-sm">
                    Hi there, I'd like to schedule a meeting with you. Here are
                    three available time options:
                    {suggestedSlots
                      .map(
                        (slot, index) =>
                          `Option ${index + 1}: ${slot.formatted}\n`,
                      )
                      .join("")}
                    Please reply with 1, 2, or 3 to book automatically.
                    {meetingNotes && `\nMeeting details:\n${meetingNotes}`}
                    Best regards, Iyashi
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <div className="space-x-3">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSendProposal}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <>Sending...</>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Proposal
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
