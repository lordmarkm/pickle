import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Bookings, Booking } from '@models';
import { environment } from 'environments/environment';
import { HttpParams } from '@angular/common/http';
import { MasterCourt } from '../models/master.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private baseUrl = `${environment.functions.baseUrl}/bookings`;
  constructor(private http: HttpClient) { }

  //TODO secure with recaptcha
  getBookings(courtId: string, date: string) {
    const params = new HttpParams()
      .set('courtId', courtId)
      .set('date', date);
    return this.http.get<Bookings>(`${this.baseUrl}`, { params });
  }

  findOne(bookingId: string) {
    return this.http.get<Booking>(`${this.baseUrl}/${bookingId}`);
  }

  newPrivateBooking(court: MasterCourt, date: string, start: string, end: string) {
    const { id, name, orgName } = court;
    const booking: Booking = {
      title: 'New booking',
      courtId: id,
      courtName: name,
      orgName,
      date,
      start,
      end,
      type: 'Private',
      paid: false
    };
    return this.http.post<Booking>(`${this.baseUrl}`, booking);
  }

  newBooking(booking: Booking) {
    return this.http.post<Booking>(this.baseUrl, booking);
  }

  updateBooking(booking: Booking) {
    return this.http.put<Booking>(`${this.baseUrl}/${booking.id}`, booking);
  }

  deleteBooking(booking: Booking) {
    return this.http.delete<Booking>(`${this.baseUrl}/${booking.id}`);
  }

  pay(bookingId: string) {
    return this.http.put<Booking>(`${this.baseUrl}/${bookingId}/pay`, {});
  }

  cancel(bookingId: string) {
    return this.http.delete<Booking>(`${this.baseUrl}/${bookingId}`);
  }
}
