import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { MapPin, Calendar, Clock } from 'lucide-react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState({
    pickup_location: '',
    dropoff_location: '',
    ride_date: '',
    ride_time: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in to book a ride');

      const { error } = await supabase.from('bookings').insert({
        user_id: user.id,
        ...booking,
        status: 'pending',
      });

      if (error) throw error;
      toast.success('Booking created successfully!');
      setBooking({
        pickup_location: '',
        dropoff_location: '',
        ride_date: '',
        ride_time: '',
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Book a Taxi</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pickup Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                value={booking.pickup_location}
                onChange={(e) =>
                  setBooking({ ...booking, pickup_location: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="Enter pickup location"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Drop-off Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                value={booking.dropoff_location}
                onChange={(e) =>
                  setBooking({ ...booking, dropoff_location: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="Enter drop-off location"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <input
                  type="date"
                  value={booking.ride_date}
                  onChange={(e) =>
                    setBooking({ ...booking, ride_date: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <div className="relative">
                <Clock
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <input
                  type="time"
                  value={booking.ride_time}
                  onChange={(e) =>
                    setBooking({ ...booking, ride_time: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {loading ? 'Creating booking...' : 'Book Now'}
          </button>
        </form>
      </div>
    </div>
  );
}