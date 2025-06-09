import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService, CourtService, AuthService } from '@services';
import { Booking, Court } from '@models';
import { MessageComponent } from 'app/components/message.component';
import { unpaidBookingsTtlInMinutes } from '../../misc/constants';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent extends MessageComponent implements OnInit, OnDestroy {
  bookingId!: string;
  booking: Booking | null = null;
  court: Court | null = null;
  unpaidBookingsTtlInMinutes = unpaidBookingsTtlInMinutes;
  private destroy$ = new Subject<void>();

  constructor(private route: ActivatedRoute, private router: Router, private courts: CourtService, private bookings: BookingService,  private auth: AuthService) {
    super();
  }
  ngOnInit() {
    const user$ = this.auth.currentUser$.pipe(
      takeUntil(this.destroy$)
    );
  
    const queryParams$ = this.route.queryParams.pipe(
      takeUntil(this.destroy$)
    );

    let unauthenticatedTimeout: any;
    combineLatest([user$, queryParams$]).subscribe(([user, params]) => {
      console.log('combineLatest. user=' + user);
      if (user === null) {
        this.setMessage('Loading authentication...');
        unauthenticatedTimeout = setTimeout(() => {
          this.setError('You must be logged in to access this page.');
        }, 2000);
        this.booking = null;
        return;
      } else {
        clearTimeout(unauthenticatedTimeout);
        this.clear();
      }
  
      const bookingId = params['bookingId'];
      this.bookingId = bookingId;
      if (bookingId) {
        this.loadBooking();
      } else {
        this.setError('No booking ID found. Click here to go back to the home page.');
      }
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  loadCourt() {
    this.courts.findOne(this.booking!.courtId).subscribe(court => {
      if (court) {
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
  cancel() {
    this.bookings.cancel(this.bookingId).subscribe({
      next: booking => {
              this.setMessage("Booking has been cancelled");
              setTimeout(() => {
                this.router.navigate(['/landing']);
              }, 1000);
            },
      error: err => this.setError("Cancel failed! err=" + err)
    });
  }

}
