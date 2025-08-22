import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  Send, 
  Users, 
  Plus, 
  Trash2, 
  Edit3,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';

interface CalendarSchedulerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TimeSlot {
  id: string;
  start: string;
  end: string;
  date: Date;
  available?: boolean;
}

interface CalendarEvent {
  start: Date;
  end: Date;
  title: string;
}

const durationOptions = [
  { value: '15', label: '15 minutes' },
  { value: '30', label: '30 minutes' },
  { value: '45', label: '45 minutes' },
  { value: '60', label: '1 hour' },
  { value: '90', label: '1.5 hours' },
  { value: '120', label: '2 hours' }
];

// Mock calendar events for availability checking
const mockCalendarEvents: CalendarEvent[] = [
  {
    start: new Date(2025, 0, 21, 9, 0), // 9:00 AM
    end: new Date(2025, 0, 21, 10, 0),  // 10:00 AM
    title: 'Team meeting'
  },
  {
    start: new Date(2025, 0, 21, 14, 0), // 2:00 PM
    end: new Date(2025, 0, 21, 15, 0),   // 3:00 PM
    title: 'Client call'
  }
];

export function CalendarSchedulerModal({ open, onOpenChange }: CalendarSchedulerModalProps) {
  const [to, setTo] = useState('');
  const [duration, setDuration] = useState('30');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingNotes, setMeetingNotes] = useState('');
  const [selectedDates, setSelectedDates] = useState<Date[] | undefined>(undefined);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [maxSlots, setMaxSlots] = useState('3');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'compose' | 'edit-slots' | 'review'>('compose');
  const [editingSlot, setEditingSlot] = useState<string | null>(null);

  // Check if a time slot conflicts with existing calendar events
  const checkAvailability = (date: Date, startTime: string, endTime: string): boolean => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const slotStart = new Date(date);
    slotStart.setHours(startHour, startMinute, 0, 0);
    
    const slotEnd = new Date(date);
    slotEnd.setHours(endHour, endMinute, 0, 0);

    return !mockCalendarEvents.some(event => {
      return (slotStart < event.end && slotEnd > event.start);
    });
  };

  const generateTimeSlots = () => {
    if (!selectedDates || selectedDates.length === 0) return;

    const workingHours = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
    ];

    const durationMins = parseInt(duration);
    const newSlots: TimeSlot[] = [];

    selectedDates.forEach(date => {
      workingHours.forEach(startTime => {
        if (newSlots.length >= parseInt(maxSlots)) return;

        const [hour, minute] = startTime.split(':').map(Number);
        const endTime = new Date(date);
        endTime.setHours(hour, minute + durationMins, 0, 0);
        const endTimeStr = format(endTime, 'HH:mm');

        const available = checkAvailability(date, startTime, endTimeStr);
        
        if (available) {
          newSlots.push({
            id: `${date.getTime()}-${startTime}`,
            start: startTime,
            end: endTimeStr,
            date: new Date(date),
            available: true
          });
        }
      });
    });

    setTimeSlots(newSlots.slice(0, parseInt(maxSlots)));
    setStep('edit-slots');
  };

  const addTimeSlot = () => {
    if (!selectedDates || selectedDates.length === 0) return;
    
    const newSlot: TimeSlot = {
      id: `new-${Date.now()}`,
      start: '09:00',
      end: '09:30',
      date: selectedDates[0],
      available: true
    };
    
    setTimeSlots(prev => [...prev, newSlot]);
    setEditingSlot(newSlot.id);
  };

  const removeTimeSlot = (id: string) => {
    setTimeSlots(prev => prev.filter(slot => slot.id !== id));
  };

  const updateTimeSlot = (id: string, updates: Partial<TimeSlot>) => {
    setTimeSlots(prev => prev.map(slot => 
      slot.id === id ? { ...slot, ...updates } : slot
    ));
  };

  const handleSendProposal = async () => {
    setIsLoading(true);
    
    try {
      const proposalData = {
        to,
        meetingTitle,
        meetingNotes,
        timeSlots,
        duration: parseInt(duration)
      };

      const response = await fetch('/api/propose-times', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proposalData)
      });

      if (response.ok) {
        handleClose();
      }
    } catch (error) {
      console.error('Failed to send proposal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTo('');
    setDuration('30');
    setMeetingTitle('');
    setMeetingNotes('');
    setSelectedDates([]);
    setTimeSlots([]);
    setStep('compose');
    setEditingSlot(null);
    onOpenChange(false);
  };

  const formatDateRange = (dates: Date[]) => {
    if (dates.length === 0) return 'No dates selected';
    if (dates.length === 1) return format(dates[0], 'MMM dd, yyyy');
    return `${format(dates[0], 'MMM dd')} - ${format(dates[dates.length - 1], 'MMM dd, yyyy')}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-0 w-[calc(100vw-2rem)] sm:w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5" />
            Schedule Meeting
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

        {step === 'compose' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Meeting Details */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Meeting Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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

                  <div className="space-y-2">
                    <Label htmlFor="title">Meeting Title</Label>
                    <Input
                      id="title"
                      placeholder="Discovery call with SolAI"
                      value={meetingTitle}
                      onChange={(e) => setMeetingTitle(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Duration</Label>
                      <Select value={duration} onValueChange={setDuration}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {durationOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Max Time Options</Label>
                      <Select value={maxSlots} onValueChange={setMaxSlots}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2 options</SelectItem>
                          <SelectItem value="3">3 options</SelectItem>
                          <SelectItem value="4">4 options</SelectItem>
                          <SelectItem value="5">5 options</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

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
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Date Selection */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Select Available Dates</CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Choose multiple dates to give more options
                  </p>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="multiple"
                    selected={selectedDates}
                    onSelect={(dates) => {
                      console.log('Calendar dates selected:', dates);
                      setSelectedDates(dates || []);
                    }}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                    className="rounded-md border w-full"
                    modifiers={{
                      selected: selectedDates
                    }}
                    modifiersStyles={{
                      selected: {
                        backgroundColor: 'hsl(var(--primary))',
                        color: 'hsl(var(--primary-foreground))',
                        borderRadius: '50%'
                      }
                    }}
                  />
                  
                  {selectedDates.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Selected Dates: {formatDateRange(selectedDates)}
                      </div>
                      <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        {selectedDates.length} date{selectedDates.length !== 1 ? 's' : ''} selected
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="text-sm">
                  <strong>Working Hours:</strong> 9:00 AM – 5:00 PM<br />
                  <strong>Time Zone:</strong> EST<br />
                  <strong>Integration:</strong> Google Calendar availability checking
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'edit-slots' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Edit Time Slots</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Customize your meeting time options
                </p>
              </div>
              <Button variant="outline" onClick={addTimeSlot}>
                <Plus className="mr-2 h-4 w-4" />
                Add Slot
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {timeSlots.map((slot, index) => (
                <Card key={slot.id} className={`${slot.available ? 'border-green-200' : 'border-red-200'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant={slot.available ? 'default' : 'destructive'}>
                        {slot.available ? (
                          <>
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Available
                          </>
                        ) : (
                          <>
                            <AlertCircle className="mr-1 h-3 w-3" />
                            Conflict
                          </>
                        )}
                      </Badge>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingSlot(editingSlot === slot.id ? null : slot.id)}
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTimeSlot(slot.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">
                        Option {index + 1}: {format(slot.date, 'MMM dd, yyyy')}
                      </div>
                      
                      {editingSlot === slot.id ? (
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            type="time"
                            value={slot.start}
                            onChange={(e) => updateTimeSlot(slot.id, { start: e.target.value })}
                          />
                          <Input
                            type="time"
                            value={slot.end}
                            onChange={(e) => updateTimeSlot(slot.id, { end: e.target.value })}
                          />
                        </div>
                      ) : (
                        <div className="text-lg font-semibold">
                          {slot.start} - {slot.end}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 'review' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Meeting Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Meeting Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div><strong>Meeting:</strong> {meetingTitle}</div>
                <div><strong>Recipient:</strong> {to}</div>
                <div><strong>Duration:</strong> {duration} minutes</div>
                {meetingNotes && <div><strong>Notes:</strong> {meetingNotes}</div>}
                
                <div className="space-y-2">
                  <strong>Time Options:</strong>
                  {timeSlots.map((slot, index) => (
                    <div key={slot.id} className="text-sm">
                      Option {index + 1}: {format(slot.date, 'MMM dd, yyyy')} at {slot.start} - {slot.end}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Email Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Email Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div>
                    <Label className="text-xs text-slate-600 dark:text-slate-400">Subject:</Label>
                    <div className="font-medium">Meeting invitation: {meetingTitle}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-600 dark:text-slate-400">Body:</Label>
                    <div className="whitespace-pre-wrap text-sm">
                      Hi there,

                      I'd like to schedule a meeting with you. Here are the available time options:

                      {timeSlots.map((slot, index) => (
                        `Option ${index + 1}: ${format(slot.date, 'MMM dd, yyyy')} at ${slot.start} - ${slot.end}\n`
                      )).join('')}
                      
                      Please reply with 1, 2, or 3 to book automatically.
                      
                      {meetingNotes && `\nMeeting details:\n${meetingNotes}`}

                      Best regards,
                      Iyashi
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between">
          {step === 'edit-slots' && (
            <Button variant="outline" onClick={() => setStep('compose')}>
              Back
            </Button>
          )}
          {step === 'review' && (
            <Button variant="outline" onClick={() => setStep('edit-slots')}>
              Back
            </Button>
          )}
          
          <div className="space-x-3 ml-auto">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            
            {step === 'compose' && (
              <Button 
                onClick={generateTimeSlots} 
                disabled={!to || !meetingTitle || selectedDates.length === 0 || isLoading}
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
            )}
            
            {step === 'edit-slots' && (
              <Button 
                onClick={() => setStep('review')} 
                disabled={timeSlots.length === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Preview Email
              </Button>
            )}
            
            {step === 'review' && (
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
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
