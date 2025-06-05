import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Booking, Court } from '@models';
import { BookingService, CourtService } from '@services';
import { MessageComponent } from '../../components/message.component';

@Component({
  selector: 'app-booking',
  standalone: false,
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent extends MessageComponent implements OnInit {
  bookingId!: string;
  booking: Booking | null = null;
  court: Court | null = null;
  constructor(private route: ActivatedRoute, private courts: CourtService, private bookings: BookingService) {
    super();
  }
  ngOnInit() {
    const bookingId = this.route.snapshot.paramMap.get('bookingId');
    if (!bookingId) {
      this.setError('No booking id found. Click here to go back to the home page.');
      return;
    }
    this.bookingId = bookingId;
    this.loadBooking();
  }
  loadBooking() {
    this.bookings.findOne(this.bookingId!).subscribe(booking => {
      this.booking = booking;
      this.loadCourt();
    }, err => {
      this.error = 'Could not find booking with id=' + this.bookingId;
    });
  }
  loadCourt() {
    this.courts.findOne(this.booking!.courtId).subscribe(court => {
      if (court) {
        this.court = court;
      }
    });
  }
}
