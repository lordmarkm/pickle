import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core';
import { BookingRequest, Court } from '@models';
import { MessageComponent } from 'app/components/message.component';
import moment from 'moment';
import { dateTimeFormat, dateFormat } from 'app/misc/dateformats';
import { BookingService } from '@services';
import { Router } from '@angular/router';
import { optionsDate, optionsTime } from '../../misc/dateformats';

@Component({
  selector: 'app-slotcontrol',
  standalone: false,
  templateUrl: './slotcontrol.component.html',
  styleUrl: './slotcontrol.component.scss'
})
export class SlotcontrolComponent extends MessageComponent implements OnInit, OnChanges {

  @Input() booking!: BookingRequest;
  @Input() court!: Court;
  @Output() cancelEvent = new EventEmitter<void>();
  checkoutMessage = '';

  constructor(private bookings: BookingService, private router: Router) {
    super();
  }

  ngOnInit() {
    this.setCheckoutMessage();
  }
  ngOnChanges() {
    this.setCheckoutMessage();
  }
  setCheckoutMessage() {
    const startTime = this.booking.start.toLocaleTimeString('en-PH', optionsTime);
    const endTime = this.booking.end.toLocaleTimeString('en-PH', optionsTime);
    const date = this.booking.end.toLocaleDateString('en-PH', optionsDate);
    this.checkoutMessage = `Selected slot is available! From ${startTime} to ${endTime} on ${date} @ ${this.court.org} ${this.court.name}`;
  }

  checkout() {
    if (!this.booking || !this.court) {
      this.setError("Booking or Court not found");
      return;
    }
    this.setMessage('Creating reservation...');
    const start = this.booking.start.toISOString();
    const end = this.booking.end.toISOString();
    const date = moment(this.booking.end).format(dateFormat);
    this.bookings.newBooking(this.court.id, date, start, end).subscribe({
      next: res => {
        this.router.navigate(['/checkout'], {queryParams: {bookingId: res.id}});
      },
      error: err => {
        this.setError('Error creating reservation. Please try again later');
      }
    });
  }
  cancel() {
    this.cancelEvent.emit();
  }
}
