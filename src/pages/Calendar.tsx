import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek, isSameMonth } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Edit, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  time: string;
  type: 'appointment' | 'task' | 'personal' | 'work';
  color: string;
}

const eventTypes = [
  { value: 'appointment', label: 'Appointment', color: 'bg-blue-500' },
  { value: 'task', label: 'Task', color: 'bg-green-500' },
  { value: 'personal', label: 'Personal', color: 'bg-purple-500' },
  { value: 'work', label: 'Work', color: 'bg-orange-500' }
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    time: '',
    type: 'appointment' as CalendarEvent['type']
  });
  const { toast } = useToast();

  // Get calendar days for the current month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  useEffect(() => {
    // Load events from localStorage
    try {
      const savedEvents = localStorage.getItem('calendar-events');
      if (savedEvents) {
        const parsedEvents = JSON.parse(savedEvents).map((event: any) => ({
          ...event,
          date: new Date(event.date)
        }));
        setEvents(parsedEvents);
      }
    } catch (error) {
      console.error("Failed to parse calendar events from localStorage", error);
      // Optionally, clear the corrupted storage
      // localStorage.removeItem('calendar-events');
      toast({
        title: "Error Loading Events",
        description: "Could not load saved events. They may be corrupted.",
        variant: "destructive",
      });
    }
  }, []);

  const saveEvents = (newEvents: CalendarEvent[]) => {
    setEvents(newEvents);
    localStorage.setItem('calendar-events', JSON.stringify(newEvents));
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsEventDialogOpen(true);
    setIsEditMode(false);
    setEditingEvent(null);
    setEventForm({
      title: '',
      description: '',
      time: '',
      type: 'appointment'
    });
  };

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDate(event.date);
    setEditingEvent(event);
    setIsEditMode(true);
    setEventForm({
      title: event.title,
      description: event.description || '',
      time: event.time,
      type: event.type
    });
    setIsEventDialogOpen(true);
  };

  const handleSaveEvent = () => {
    if (!eventForm.title || !eventForm.time || !selectedDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const eventType = eventTypes.find(type => type.value === eventForm.type);
    const newEvent: CalendarEvent = {
      id: isEditMode ? editingEvent!.id : Date.now().toString(),
      title: eventForm.title,
      description: eventForm.description,
      date: selectedDate,
      time: eventForm.time,
      type: eventForm.type,
      color: eventType?.color || 'bg-blue-500'
    };

    let updatedEvents;
    if (isEditMode) {
      updatedEvents = events.map(event => 
        event.id === editingEvent!.id ? newEvent : event
      );
    } else {
      updatedEvents = [...events, newEvent];
    }

    // Save locally
    saveEvents(updatedEvents);
    
    setIsEventDialogOpen(false);
    
    toast({
      title: "Success!",
      description: `Event ${isEditMode ? 'updated' : 'created'} successfully.`,
    });
  };

  const handleDeleteEvent = () => {
    if (editingEvent) {
      const updatedEvents = events.filter(event => event.id !== editingEvent.id);
      saveEvents(updatedEvents);
      
      setIsEventDialogOpen(false);
      toast({
        title: "Event Deleted",
        description: "Event has been removed from your calendar.",
      });
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
  };

  return (
    <div className="min-h-screen bg-background bg-[#DB6C79]/10">
        <div className="container mx-auto p-4 md:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <CalendarIcon className="h-8 w-8 text-primary" />
                Calendar
              </h1>
              <p className="text-muted-foreground">Click on dates to schedule events</p>
            </div>
            {/* <Button 
              onClick={() => handleDateClick(new Date())}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button> */}
            {/* Event Types Legend */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Event Types</h3>
              <div className="flex flex-wrap gap-3">
                {eventTypes.map(type => (
                  <div key={type.value} className="flex items-center gap-2">
                    <div className={cn("w-4 h-4 rounded", type.color)}></div>
                    <span className="text-sm">{type.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          </div>

          {/* Calendar Navigation */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('next')}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}

                {/* Calendar days */}
                {calendarDays.map(day => {
                  const dayEvents = getEventsForDate(day);
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const isCurrentDay = isToday(day);

                  return (
                    <div
                      key={day.toString()}
                      className={cn(
                        "min-h-[100px] p-1 border border-border cursor-pointer hover:bg-muted/50 transition-colors",
                        !isCurrentMonth && "text-muted-foreground bg-muted/20",
                        isCurrentDay && "bg-primary/10 border-primary"
                      )}
                      onClick={() => handleDateClick(day)}
                    >
                      <div className={cn(
                        "text-sm font-medium mb-1",
                        isCurrentDay && "text-primary font-bold"
                      )}>
                        {format(day, 'd')}
                      </div>
                      
                      {/* Events for this day */}
                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map(event => (
                          <div
                            key={event.id}
                            className={cn(
                              "text-xs p-1 rounded truncate cursor-pointer hover:opacity-80",
                              event.color,
                              "text-white"
                            )}
                            onClick={(e) => handleEventClick(event, e)}
                            title={`${event.title} at ${event.time}`}
                          >
                            {event.time} {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          
        </div>

        {/* Event Dialog */}
        <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                {isEditMode ? 'Edit Event' : 'Add New Event'}
                {selectedDate && (
                  <span className="text-sm font-normal text-muted-foreground">
                    {format(selectedDate, 'MMMM d, yyyy')}
                  </span>
                )}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={eventForm.title}
                  onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter event title"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={eventForm.time}
                  onChange={(e) => setEventForm(prev => ({ ...prev, time: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="type">Event Type</Label>
                <Select
                  value={eventForm.type}
                  onValueChange={(value: CalendarEvent['type']) => 
                    setEventForm(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <div className={cn("w-3 h-3 rounded", type.color)}></div>
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={eventForm.description}
                  onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Add event description (optional)"
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleSaveEvent}
                  className="flex-1"
                >
                  {isEditMode ? 'Update Event' : 'Create Event'}
                </Button>
                {isEditMode && (
                  <Button
                    variant="destructive"
                    onClick={handleDeleteEvent}
                    className="px-3"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setIsEventDialogOpen(false)}
                  className="px-3"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
  );
}
