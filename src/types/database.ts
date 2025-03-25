export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  created_at: string;
  is_admin: boolean;
}

export interface Booking {
  id: string;
  user_id: string;
  pickup_location: string;
  dropoff_location: string;
  ride_date: string;
  ride_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  user?: {
    profiles: {
      full_name: string;
      phone: string;
    };
  };
}