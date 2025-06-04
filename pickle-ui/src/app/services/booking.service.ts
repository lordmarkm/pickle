import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Bookings, Booking } from '@models';
import { environment } from 'environments/environment';
import { HttpParams } from '@angular/common/http';

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

  newBooking(courtId: string, date: string, start: string, end: string) {
    const booking: Booking = {
      title: 'New booking',
      courtId,
      date,
      start,
      end,
      type: 'Private',
      paid: false
    };
    return this.http.post<Booking>(`${this.baseUrl}`, booking);
  }
}
