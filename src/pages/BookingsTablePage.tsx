import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Table, TableHeader, TableBody, TableRow, TableCell, TableHead,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Trash2 } from 'lucide-react';

interface Booking {
  id: string;
  user_id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  appointment_date: string;
  appointment_time: string | null;
  location: string | null;
  message: string | null;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  service: string;
  created_at: string;
  updated_at: string;
}

const statusOptions = ['pending', 'confirmed', 'completed', 'cancelled'] as const;

const BookingsTablePage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState<keyof Booking>('appointment_date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Convert 24-hour time to 12-hour format with AM/PM
  const formatTime = (time: string | null) => {
    if (!time) return '-';
    
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Fetch bookings from Supabase
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setFetchError(null);

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order(sortKey, { ascending: sortOrder === 'asc' });

      setLoading(false);

      if (error) {
        setFetchError(error.message || 'Failed to fetch bookings');
        setBookings([]);
        return;
      }

      if (Array.isArray(data)) {
        setBookings(data as any);
      } else {
        setBookings([]);
      }
    };
    fetchBookings();
  }, [sortKey, sortOrder]);

  // Filter bookings by client name, email, phone, or service (case-insensitive)
  const filteredBookings = bookings.filter((b) =>
    [b.client_name, b.client_email, b.client_phone, b.service, b.location ?? '']
      .some((field) => field.toLowerCase().includes(filter.toLowerCase()))
  );

  // Sort bookings: cancelled at bottom, others sorted normally
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (a.status === 'cancelled' && b.status !== 'cancelled') return 1;
    if (a.status !== 'cancelled' && b.status === 'cancelled') return -1;
    return 0;
  });

  // Handle sorting
  const handleSort = (key: keyof Booking) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  // Update status in DB and local state
  const updateStatus = async (id: string, status: Booking['status']) => {
    // Optimistic update
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );

    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
      // Rollback or notify user if needed
    }
  };

  // Delete booking
  const deleteBooking = async (id: string) => {
    // if (!confirm('Are you sure you want to delete this booking?')) return;

    // Optimistic delete
    setBookings((prev) => prev.filter((b) => b.id !== id));

    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting booking:', error);
      // Rollback by re-fetching if needed
      alert('Failed to delete booking. Please try again.');
    }
  };

  return (
    <>
      <hr />
      <div className="container mx-auto p-6 bg-[#DB6C79]/10">
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Filter bookings..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <div className="rounded-lg shadow border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort('client_name')}
                >
                  Name {sortKey === 'client_name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort('client_email')}
                >
                  Email {sortKey === 'client_email' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort('client_phone')}
                >
                  Phone {sortKey === 'client_phone' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort('service')}
                >
                  Service {sortKey === 'service' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort('appointment_date')}
                >
                  Date {sortKey === 'appointment_date' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort('appointment_time')}
                >
                  Time {sortKey === 'appointment_time' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort('location')}
                >
                  Location {sortKey === 'location' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead> {/* Actions */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={9}>Loading...</TableCell>
                </TableRow>
              )}
              {!loading && fetchError && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-destructive">
                    {fetchError}
                  </TableCell>
                </TableRow>
              )}
              {!loading && !fetchError && sortedBookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">
                    No bookings found.
                  </TableCell>
                </TableRow>
              )}
              {sortedBookings.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>{b.client_name}</TableCell>
                  <TableCell>{b.client_email}</TableCell>
                  <TableCell>{b.client_phone}</TableCell>
                  <TableCell>{b.service}</TableCell>
                  <TableCell>
                    {new Date(b.appointment_date).toLocaleDateString('en-IN')}
                  </TableCell>
                  <TableCell>{formatTime(b.appointment_time)}</TableCell>
                  <TableCell>{b.location || '-'}</TableCell>
                  <TableCell>
                    <span
                      className={`capitalize rounded px-2 py-1 text-xs font-semibold ${
                        b.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : b.status === 'confirmed'
                          ? 'bg-blue-100 text-blue-700'
                          : b.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {b.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {/* Status change options */}
                          {statusOptions.map((option) => (
                            <DropdownMenuItem
                              key={option}
                              onClick={() => updateStatus(b.id, option)}
                            >
                              Set to {option.charAt(0).toUpperCase() + option.slice(1)}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => deleteBooking(b.id)}
                      >
                        <span className="sr-only">Delete booking</span>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default BookingsTablePage;