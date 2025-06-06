import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Booking, Court } from '@models';
import { BookingService } from '@services';
import { MessageComponent } from 'app/components/message.component';
import { CourtDisplayService } from '../../services/courtdisplay.service';

@Component({
  selector: 'app-eventcontrol',
  standalone: false,
  templateUrl: './eventcontrol.component.html',
  styleUrl: './eventcontrol.component.scss'
})
export class EventcontrolComponent extends MessageComponent {

  @Input() booking!: Booking;
  @Input() court!: Court;
  @Output() cancelEvent = new EventEmitter<void>();

  constructor(private bookings: BookingService, private router: Router, private courtDisplayService: CourtDisplayService) {
    super();
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
