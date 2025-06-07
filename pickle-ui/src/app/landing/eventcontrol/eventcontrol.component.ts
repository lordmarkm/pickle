import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Booking, Court } from '@models';
import { BookingService, CourtDisplayService, AuthService } from '@services';
import { MessageComponent } from 'app/components/message.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { unpaidBookingsTtlInMinutes } from '../../misc/constants';

@Component({
  selector: 'app-eventcontrol',
  standalone: false,
  templateUrl: './eventcontrol.component.html',
  styleUrl: './eventcontrol.component.scss'
})
export class EventcontrolComponent extends MessageComponent implements OnInit, OnDestroy {

  @Input() booking!: Booking;
  @Input() court!: Court;
  @Output() cancelEvent = new EventEmitter<void>();
  private destroy$ = new Subject<void>();
  owner = false;
  unpaidBookingsTtlInMinutes = unpaidBookingsTtlInMinutes;

  constructor(private bookings: BookingService, private router: Router, private courtDisplayService: CourtDisplayService, private auth: AuthService) {
    super();
  }

  ngOnInit() {
    this.auth.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.owner = user?.uid === this.booking?.createdBy;
      });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  checkout() {
    this.setMessage('Redirecting to checkout page...');
    this.router.navigate(['/checkout'], {queryParams: {bookingId: this.booking.id}});
  }
  cancel() {
    this.bookings.cancel(this.booking.id!).subscribe({
      next: booking => {
        this.setMessage('Booking has been cancelled: ' + this.booking.title);
        setTimeout(() => {
          this.cancelEvent.emit();
          this.courtDisplayService.triggerRefresh(this.court.id);
        }, 1000);
      },
      error: err => this.setError('Cancel failed: ' + err)
    })
  }
  backToCalendar() {
    this.cancelEvent.emit();
  }

}
