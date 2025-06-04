/**
 * List of bookings for the day
 */

export interface Bookings {
  courtId: string;
  date: Date;
  bookings: Booking[];
}

export interface Booking {
  courtId: string;
  date: string;
  start: string;
  end: string;
  title: string;
  type: 'Private' | 'Open Play';
  paid: boolean;
}
