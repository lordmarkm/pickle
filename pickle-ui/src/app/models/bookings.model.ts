export interface Bookings {
  courtId: string;
  date: Date;
  bookings: Booking[];
}

export interface Booking {
  id?: string;
  courtId: string;
  date: string;
  start: string;
  end: string;
  title: string;
  type: 'Private' | 'Open Play' | 'Block';
  paid: boolean;
  color?: string;
  createdBy?: string;
  createdDate?: string;
  deleted?: boolean;
}

export const EventColors = {
  booked: '#3788d8', // FC default blue
  paid: '#4CAF50',   // light green
  blocked: '#b0b0b0', //light grey
  op: '#f58b4e' // light orange
};

export interface BookingRequest {
  start: Date,
  end: Date
}