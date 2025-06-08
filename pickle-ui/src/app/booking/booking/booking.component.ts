import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Booking, Court } from '@models';
import { BookingService, CourtService, AuthService } from '@services';
import { MessageComponent } from '../../components/message.component';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-booking',
  standalone: false,
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent extends MessageComponent implements OnInit, OnDestroy {
  bookingId!: string;
  booking: Booking | null = null;
  court: Court | null = null;
  private destroy$ = new Subject<void>();
  constructor(private route: ActivatedRoute, private courts: CourtService, private bookings: BookingService,  private auth: AuthService) {
    super();
  }
  ngOnInit() {
    const user$ = this.auth.currentUser$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => {
      if (!user) {
        this.setError('You must be logged in to access this page.');
        return;
      }
      this.error = null;

      const bookingId = this.route.snapshot.paramMap.get('bookingId');
      if (!bookingId) {
        this.setError('No booking id found. Click here to go back to the home page.');
        return;
      }
      this.bookingId = bookingId;
      this.loadBooking();
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
