import { RequestHandler } from "express";

// Mock data for demonstration
const mockEmailTemplates = [
  {
    key: "intro",
    subject: "Quick intro, {recipientFirst}",
    body: "Hi {recipientFirst},\n\nI'm {senderFirst} from {business}. We specialize in helping businesses like yours with automation solutions.\n\nWould you be interested in a brief call to discuss how we could help streamline your workflows?\n\nBest regards,\n{senderFirst}",
  },
  {
    key: "reminder1",
    subject: "Following up on {topic}",
    body: "Hello {recipientFirst},\n\nJust checking on {topic}. If you have any questions or need clarification on anything, please let me know.\n\nThanks!\n{senderFirst}",
  },
  {
    key: "thanks",
    subject: "Thank you!",
    body: "Thanks {recipientFirst}���really appreciate your time on {topic}. Looking forward to our next steps!\n\nBest,\n{senderFirst}",
  },
];

const mockCalendarEvents = [
  {
    id: "abc123",
    start: "2025-01-21T10:30:00-04:00",
    end: "2025-01-21T11:00:00-04:00",
    summary: "Discovery call – Priya",
    attendees: ["priya@example.com"],
    hangoutLink: "https://meet.google.com/xyz",
    location: "Google Meet",
  },
  {
    id: "def456",
    start: "2025-01-21T14:00:00-04:00",
    end: "2025-01-21T14:30:00-04:00",
    summary: "Team standup",
    attendees: ["team@solai.com"],
    hangoutLink: "https://meet.google.com/abc",
  },
  {
    id: "ghi789",
    start: "2025-01-21T16:00:00-04:00",
    end: "2025-01-21T17:00:00-04:00",
    summary: "Client presentation",
    attendees: ["client@acme.com", "john@acme.com"],
  },
];

// Send Template Email webhook endpoint
export const handleSendTemplate: RequestHandler = async (req, res) => {
  try {
    const { templateKey, to, vars, useAIPolish } = req.body;

    // Find the template
    const template = mockEmailTemplates.find((t) => t.key === templateKey);
    if (!template) {
      return res.status(400).json({ error: "Template not found" });
    }

    // Replace variables in template
    let subject = template.subject;
    let body = template.body;

    Object.entries(vars).forEach(([variable, value]) => {
      const regex = new RegExp(`{${variable}}`, "g");
      subject = subject.replace(regex, value as string);
      body = body.replace(regex, value as string);
    });

    // Simulate AI polishing if requested
    if (useAIPolish) {
      // In real implementation, this would call an LLM API
      console.log("AI polishing requested for email");
    }

    // Simulate sending email (in real implementation, this would integrate with Gmail API)
    console.log("Sending email:", { to, subject, body });

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    res.json({
      success: true,
      messageId: `msg_${Date.now()}`,
      subject,
      body,
    });
  } catch (error) {
    console.error("Error sending template email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
};

// Get events organized by "This Week" and "Later" webhook endpoint
export const handleGetEventsToday: RequestHandler = async (req, res) => {
  try {
    // In real implementation, this would read from your Google Sheets
    // that gets populated by your n8n workflow
    const now = new Date();
    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() + 7);

    const events = mockCalendarEvents.map((event) => ({
      ...event,
      timeUntilStart: new Date(event.start).getTime() - Date.now(),
      formattedTime: new Date(event.start).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    }));

    // Separate events into "This Week" and "Later"
    const thisWeekEvents = events
      .filter((event) => {
        const eventDate = new Date(event.start);
        return eventDate <= weekEnd;
      })
      .sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
      );

    const laterEvents = events
      .filter((event) => {
        const eventDate = new Date(event.start);
        return eventDate > weekEnd;
      })
      .sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
      );

    res.json({
      thisWeek: thisWeekEvents,
      later: laterEvents,
      total: events.length,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

// Enhanced propose meeting times webhook endpoint
export const handleProposeTimes: RequestHandler = async (req, res) => {
  try {
    const { to, meetingTitle, meetingNotes, timeSlots, duration } = req.body;

    // timeSlots now comes from the frontend with the structure:
    // [{ id, start, end, date, available }]

    // Format time slots for email
    const formattedSlots = timeSlots.map((slot: any, index: number) => {
      const date = new Date(slot.date);
      const dateStr = date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return {
        ...slot,
        formatted: `${dateStr}, ${slot.start}–${slot.end}`,
        option: index + 1,
      };
    });

    // Simulate email composition and sending
    const emailSubject = `Meeting invitation: ${meetingTitle}`;
    const emailBody = `Hi there,

I'd like to schedule a meeting with you. Here are the available time options:

${formattedSlots.map((slot) => `Option ${slot.option}: ${slot.formatted}`).join("\n")}

Please reply with ${formattedSlots.map((_, i) => i + 1).join(", ")} to book automatically.

${meetingNotes ? `\nMeeting details:\n${meetingNotes}` : ""}

Best regards,
Iyashi`;

    // In a real implementation, this would:
    // 1. Check Google Calendar for actual availability conflicts
    // 2. Send the email via Gmail API
    // 3. Create calendar placeholder events
    // 4. Set up email parsing for responses

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Sending enhanced meeting proposal:", {
      to,
      meetingTitle,
      timeSlots: formattedSlots.length,
      emailSubject,
      emailBody,
    });

    res.json({
      success: true,
      timeSlots: formattedSlots,
      emailSent: true,
      messageId: `proposal_${Date.now()}`,
      calendarIntegration: "Google Calendar availability checked",
      emailSubject,
      emailPreview: emailBody.substring(0, 200) + "...",
    });
  } catch (error) {
    console.error("Error proposing times:", error);
    res.status(500).json({ error: "Failed to propose meeting times" });
  }
};

// Schedule follow-up webhook endpoint
export const handleScheduleFollowup: RequestHandler = async (req, res) => {
  try {
    const { emailId, days, threadLink, recipientName } = req.body;

    // Calculate follow-up date
    const followupDate = new Date();
    followupDate.setDate(followupDate.getDate() + days);

    // In real implementation, this would create a Google Calendar event
    console.log("Scheduling follow-up:", {
      emailId,
      followupDate: followupDate.toISOString(),
      threadLink,
      recipientName,
    });

    res.json({
      success: true,
      followupDate: followupDate.toISOString(),
      calendarEventId: `followup_${Date.now()}`,
    });
  } catch (error) {
    console.error("Error scheduling follow-up:", error);
    res.status(500).json({ error: "Failed to schedule follow-up" });
  }
};

// Run invoice reminders webhook endpoint
export const handleRunInvoiceReminders: RequestHandler = async (req, res) => {
  try {
    // Mock invoice reminder processing
    const remindersProcessed = [
      { invoice: "INV-1023", client: "Acme Corp", action: "overdue_1" },
      { invoice: "INV-1024", client: "Delta Inc", action: "due_soon" },
    ];

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Invoice reminders processed:", remindersProcessed);

    res.json({
      success: true,
      remindersProcessed,
      totalProcessed: remindersProcessed.length,
    });
  } catch (error) {
    console.error("Error running invoice reminders:", error);
    res.status(500).json({ error: "Failed to run invoice reminders" });
  }
};

// Webhook endpoint for n8n to sync calendar events to Google Sheets
export const handleSyncCalendarEvents: RequestHandler = async (req, res) => {
  try {
    const { events, sheetId, sheetName = "CalendarEvents" } = req.body;

    // This endpoint will be called by your n8n workflow
    // to sync calendar events to Google Sheets

    console.log("Syncing calendar events to Google Sheets:", {
      eventsCount: events?.length || 0,
      sheetId,
      sheetName,
    });

    // In your n8n workflow, you'll:
    // 1. Fetch events from Google Calendar
    // 2. Format them into the structure below
    // 3. POST to this endpoint
    // 4. This endpoint will update your Google Sheets

    // Expected event structure from n8n:
    // {
    //   "events": [
    //     {
    //       "id": "calendar_event_id",
    //       "title": "Meeting Title",
    //       "start": "2025-01-21T10:30:00-05:00",
    //       "end": "2025-01-21T11:00:00-05:00",
    //       "attendees": ["email1@example.com", "email2@example.com"],
    //       "meetLink": "https://meet.google.com/abc",
    //       "location": "Conference Room A",
    //       "description": "Meeting description"
    //     }
    //   ],
    //   "sheetId": "your_google_sheets_id",
    //   "sheetName": "CalendarEvents"
    // }

    res.json({
      success: true,
      message: "Calendar events synced successfully",
      eventsProcessed: events?.length || 0,
      sheetId,
      sheetName,
    });
  } catch (error) {
    console.error("Error syncing calendar events:", error);
    res.status(500).json({ error: "Failed to sync calendar events" });
  }
};
