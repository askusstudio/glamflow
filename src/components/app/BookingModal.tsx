import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const [durationEstimate, setDurationEstimate] = useState('');
  const [skinType, setSkinType] = useState('');
  const [allergiesConcerns, setAllergiesConcerns] = useState('');
  const [makeupLookPreference, setMakeupLookPreference] = useState('');
  const [eventType, setEventType] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState('1');
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
          client_email: clientEmail,
          client_phone: clientPhone,
          location: location || null,
          message: message || null,
          appointment_date: selectedDate.toISOString().split('T')[0],
          appointment_time: selectedDate.toISOString(),
          service: profile.services || 'General',
          status: 'pending',
          duration_estimate: durationEstimate || null,
          skin_type: skinType || null,
          allergies_concerns: allergiesConcerns || null,
          makeup_look_preference: makeupLookPreference || null,
          event_type: eventType || null,
          number_of_people: numberOfPeople ? parseInt(numberOfPeople) : 1
        });

      if (error) throw error;
      onClose();
    } catch (err) {
      console.error('Error booking:', err);
      setError('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !loading) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Freelancer</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4" onKeyPress={handleKeyPress}>
          {error && <p className="text-destructive text-sm">{error}</p>}
          
          <div className="grid gap-2">
            <Label htmlFor="date">Select Date *</Label>
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date) => setSelectedDate(date)}
              filterDate={isDateAvailable}
              placeholderText="Pick a date"
              minDate={new Date()}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Your Name *</Label>
            <Input id="name" value={clientName} onChange={(e) => setClientName(e.target.value)} required />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} required />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone *</Label>
            <Input id="phone" type="tel" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="eventType">Event Type</Label>
            <select
              id="eventType"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full p-2 border rounded bg-background"
            >
              <option value="">Select event type</option>
              <option value="wedding">Wedding</option>
              <option value="birthday">Birthday</option>
              <option value="photoshoot">Photoshoot</option>
              <option value="party">Party</option>
              <option value="casual">Casual</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="durationEstimate">Duration Estimate</Label>
            <select
              id="durationEstimate"
              value={durationEstimate}
              onChange={(e) => setDurationEstimate(e.target.value)}
              className="w-full p-2 border rounded bg-background"
            >
              <option value="">Select duration</option>
              <option value="1 hour">1 hour</option>
              <option value="2 hours">2 hours</option>
              <option value="3 hours">3 hours</option>
              <option value="4+ hours">4+ hours</option>
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="skinType">Skin Type</Label>
            <select
              id="skinType"
              value={skinType}
              onChange={(e) => setSkinType(e.target.value)}
              className="w-full p-2 border rounded bg-background"
            >
              <option value="">Select skin type</option>
              <option value="oily">Oily</option>
              <option value="dry">Dry</option>
              <option value="combination">Combination</option>
              <option value="sensitive">Sensitive</option>
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="makeupLookPreference">Makeup Look Preference</Label>
            <select
              id="makeupLookPreference"
              value={makeupLookPreference}
              onChange={(e) => setMakeupLookPreference(e.target.value)}
              className="w-full p-2 border rounded bg-background"
            >
              <option value="">Select look preference</option>
              <option value="natural">Natural</option>
              <option value="glam">Glam</option>
              <option value="editorial">Editorial</option>
              <option value="bridal">Bridal</option>
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="allergiesConcerns">Allergies or Skin Concerns</Label>
            <Textarea 
              id="allergiesConcerns" 
              value={allergiesConcerns} 
              onChange={(e) => setAllergiesConcerns(e.target.value)} 
              placeholder="Any allergies or skin concerns we should know about?"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="location">Location/Address</Label>
            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="numberOfPeople">Number of People</Label>
            <Input 
              id="numberOfPeople" 
              type="number" 
              min="1" 
              value={numberOfPeople} 
              onChange={(e) => setNumberOfPeople(e.target.value)} 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="message">Additional Message</Label>
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
