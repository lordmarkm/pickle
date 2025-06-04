import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService, CourtService } from '@services';
import { Booking, Court } from '@models';
import { MessageComponent } from 'app/components/message.component';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent extends MessageComponent implements OnInit {
  bookingId!: string;
  booking: Booking | null = null;
  court: Court | null = null;
  constructor(private route: ActivatedRoute, private router: Router, private courts: CourtService, private bookings: BookingService) {
    super();
  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const bookingId = params['bookingId'];
      console.log('Received bookingId:', bookingId);
      this.bookingId = bookingId;
      if (bookingId) {
        this.loadBooking();
      } else {
        this.error = 'No booking id found. Click here to go back to the home page.';
      }
    });
  }
  loadCourt() {
    this.courts.findOne(this.booking!.courtId).subscribe(court => {
      if (court) {
        console.log('found court: ' + court.name);
        this.court = court;
      }
    });
  }
  loadBooking() {
    this.bookings.findOne(this.bookingId!).subscribe(booking => {
        this.booking = booking;
        this.loadCourt();
    }, err => {
        this.error = 'Could not find booking with id=' + this.bookingId;
    });
  }
  pay() {
    this.bookings.pay(this.bookingId).subscribe(booking => {
      if (booking.paid) {
        this.setMessage("Payment successful");
        setTimeout(() => {
          this.router.navigate(['/booking', booking.id]);
        }, 1000);
      } else {
        this.setError("The put request was successful but Payment failed!");
      }
    }, err => {
      this.setError("Payment failed! " + err);
    });
  }
}
