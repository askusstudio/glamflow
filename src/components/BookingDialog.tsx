import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { CalendarIcon, Calendar as CalendarLucide } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookingDialogProps {
  freelancerId: string;
  freelancerName: string;
  availableDays: string[];
  services: string;
  children: React.ReactNode;
}

const BookingDialog = ({ freelancerId, freelancerName, availableDays, services, children }: BookingDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    location: '',
    message: '',
  });

  const { toast } = useToast();

  // Get available dates based on available days
  const isDateAvailable = (date: Date) => {
    const dayName = format(date, 'EEEE');
    return availableDays.includes(dayName) && date >= new Date();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBooking = async () => {
    if (!selectedDate || !formData.clientName || !formData.clientEmail || !formData.clientPhone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .insert({
          user_id: freelancerId,
          client_name: formData.clientName,
          client_email: formData.clientEmail,
          client_phone: formData.clientPhone,
          location: formData.location || null,
          message: formData.message || null,
          appointment_date: format(selectedDate, 'yyyy-MM-dd'),
          appointment_time: selectedDate.toISOString(),
          service: services || 'General Service',
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Booking Successful!",
        description: `Your booking request has been sent to ${freelancerName}. They will contact you soon.`,
      });

      // Reset form and close dialog
      setFormData({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        location: '',
        message: '',
      });
      setSelectedDate(undefined);
      setOpen(false);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Book {freelancerName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Available Days */}
          <div>
            <Label className="text-base font-semibold">Available Days</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {availableDays.map((day) => (
                <Badge key={day} variant="secondary">
                  {day}
                </Badge>
              ))}
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <Label className="text-base font-semibold">Select Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-2",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => !isDateAvailable(date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Client Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientName">Your Name *</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => handleInputChange('clientName', e.target.value)}
                placeholder="Enter your full name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="clientEmail">Email *</Label>
              <Input
                id="clientEmail"
                type="email"
                value={formData.clientEmail}
                onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                placeholder="your@email.com"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="clientPhone">Phone Number *</Label>
            <Input
              id="clientPhone"
              type="tel"
              value={formData.clientPhone}
              onChange={(e) => handleInputChange('clientPhone', e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="location">Location (Optional)</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Where should the service be provided?"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Describe the work you need done or any special requirements..."
              rows={4}
              className="mt-1"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleBooking}
              disabled={loading}
              className="flex-1"
            >
              {loading ? "Booking..." : "Book Now"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;