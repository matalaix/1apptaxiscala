
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Profile() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserBookings = async () => {
    setLoading(true);
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (!user || authError) {
      setBookings([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('bookings')
      .select('id, pickup_location, dropoff_location, ride_date, ride_time, status')
      .eq('user_id', user.id)
      .order('ride_date', { ascending: false });

    if (!error && data) {
      setBookings(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserBookings();
  }, []);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Mis Reservas</h1>
      {loading ? (
        <p>Cargando reservas...</p>
      ) : bookings.length === 0 ? (
        <p>No tienes reservas registradas.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="border p-4 rounded shadow">
              <p><strong>Origen:</strong> {booking.pickup_location}</p>
              <p><strong>Destino:</strong> {booking.dropoff_location}</p>
              <p><strong>Fecha:</strong> {booking.ride_date}</p>
              <p><strong>Hora:</strong> {booking.ride_time}</p>
              <p><strong>Estado:</strong> {booking.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
