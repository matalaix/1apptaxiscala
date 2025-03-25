
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('id, pickup_location, dropoff_location, ride_date, ride_time, status, profiles ( full_name, phone )')
      .order('ride_date', { ascending: true });

    if (!error && data) {
      setBookings(data);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('bookings').update({ status: newStatus }).eq('id', id);
    if (!error) fetchBookings();
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      {loading ? <p>Cargando reservas...</p> : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="border p-4 rounded shadow">
              <p><strong>Cliente:</strong> {booking.profiles?.full_name || 'Desconocido'}</p>
              <p><strong>Teléfono:</strong> {booking.profiles?.phone || '-'}</p>
              <p><strong>Origen:</strong> {booking.pickup_location}</p>
              <p><strong>Destino:</strong> {booking.dropoff_location}</p>
              <p><strong>Fecha:</strong> {booking.ride_date}</p>
              <p><strong>Hora:</strong> {booking.ride_time}</p>
              <p><strong>Estado:</strong> {booking.status}</p>
              <div className="flex gap-2 mt-2">
                <button onClick={() => updateStatus(booking.id, 'aceptada')} className="bg-green-600 text-white px-2 py-1 rounded">Aceptar</button>
                <button onClick={() => updateStatus(booking.id, 'cancelada')} className="bg-red-600 text-white px-2 py-1 rounded">Cancelar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
