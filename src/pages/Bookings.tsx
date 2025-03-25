
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Bookings() {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (!user || authError) {
      alert('Debes iniciar sesión primero.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('bookings').insert([{
      user_id: user.id,
      pickup_location: pickup,
      dropoff_location: dropoff,
      ride_date: date,
      ride_time: time,
      status: 'pendiente'
    }]);

    if (error) {
      alert('Error al crear la reserva: ' + error.message);
    } else {
      alert('Reserva creada con éxito.');
      setPickup('');
      setDropoff('');
      setDate('');
      setTime('');
    }

    setLoading(false);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Reservar Taxi</h1>
      <form onSubmit={handleBooking} className="space-y-4">
        <input type="text" placeholder="Lugar de recogida" className="w-full border px-3 py-2 rounded" value={pickup} onChange={(e) => setPickup(e.target.value)} required />
        <input type="text" placeholder="Destino" className="w-full border px-3 py-2 rounded" value={dropoff} onChange={(e) => setDropoff(e.target.value)} required />
        <input type="date" className="w-full border px-3 py-2 rounded" value={date} onChange={(e) => setDate(e.target.value)} required />
        <input type="time" className="w-full border px-3 py-2 rounded" value={time} onChange={(e) => setTime(e.target.value)} required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full" disabled={loading}>
          {loading ? 'Reservando...' : 'Reservar'}
        </button>
      </form>
    </div>
  );
}
