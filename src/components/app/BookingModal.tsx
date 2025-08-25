import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import DatePicker from 'react-datepicker'; // Import the alternative
import 'react-datepicker/dist/react-datepicker.css'; // Basic styles (customize with Tailwind if needed)

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    id: string;
    available_days: string[] | null;
    services: string | null;
  };
}

const BookingModal = ({ isOpen, onClose, profile }: BookingModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // Changed to null for react-datepicker
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('appointment_date')
          .eq('user_id', profile.id)
          .gte('appointment_date', new Date().toISOString().split('T')[0]);

        if (error) throw error;
        setBookedDates(data.map((item: any) => new Date(item.appointment_date)));
      // In handleSubmit's catch block
} catch (err) {
    console.error('Detailed booking error:', err); // Add this
    setError('Booking failed: ' + (err.message || 'Please try again.'));
  }
  
    };

    if (isOpen) fetchBookedDates();
  }, [isOpen, profile.id]);

  const isDateAvailable = (date: Date) => {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const isAvailableDay = profile.available_days?.includes(dayName) ?? false;
    const isBooked = bookedDates.some(
      (booked) => booked.toDateString() === date.toDateString()
    );
    const isFuture = date > new Date();
    return isAvailableDay && !isBooked && isFuture;
  };

  const handleSubmit = async () => {
    if (!selectedDate || !clientName || !clientEmail || !clientPhone) {
      setError('Please fill all required fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('appointments')
        .insert({
          user_id: profile.id,
          client_name: clientName,
          appointment_time: selectedDate.toISOString(),
          service: profile.services || 'General',
          status: 'pending'
        } as any);

      if (error) throw error;
      onClose();
    } catch (err) {
      console.error('Error booking:', err);
      setError('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book Freelancer</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {error && <p className="text-destructive text-sm">{error}</p>}
          
          <div className="grid gap-2">
            <Label htmlFor="date">Select Date (Available days only)</Label>
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date) => setSelectedDate(date)}
              filterDate={isDateAvailable}
              placeholderText="Pick a date"
              minDate={new Date()}
              className="w-full p-2 border rounded" // Basic styling; customize as needed
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="name">Your Name</Label>
            <Input id="name" value={clientName} onChange={(e) => setClientName(e.target.value)} required />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} required />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} required />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="location">Location/Address (Optional)</Label>
            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="message">Message/Work Description</Label>
            <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Booking...' : 'Book Now'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
