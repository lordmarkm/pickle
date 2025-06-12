import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core';
import { BookingRequest, MasterCourt } from '@models';
import { MessageComponent } from 'app/components/message.component';
import moment from 'moment';
import { dateFormat, optionsDate, optionsTime } from 'app/misc/dateformats';
import { BookingService } from '@services';
import { Router } from '@angular/router';
import { fadeIn, fadeInOut } from 'app/misc/animations';

@Component({
  selector: 'app-owner-slotcontrol',
  standalone: false,
  templateUrl: './owner.slotcontrol.component.html',
  styleUrl: './owner.slotcontrol.component.scss',
  animations: [ fadeInOut, fadeIn]
})
export class OwnerSlotcontrolComponent extends MessageComponent implements OnInit, OnChanges {

  @Input() booking!: BookingRequest;
  @Input() court!: MasterCourt;
  @Output() cancelEvent = new EventEmitter<void>();
  @Output() bookingCreatedEvent = new EventEmitter<void>();
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
    this.checkoutMessage = `You have selected the time slot from ${startTime} to ${endTime} on ${date} @ ${this.court.orgName} ${this.court.name}`;
  }

  block() {
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
        this.bookingCreatedEvent.emit();
        this.router.navigate(['/checkout'], {queryParams: {bookingId: res.id}});
      },
      error: err => {
        if (err.status === 409) {
          const conflictingBooking = err.error?.booking;
          if (conflictingBooking) {
            this.setError(`You already have an unconfirmed booking and we only allow one of those at a time. Your unconfirmed booking is on ${conflictingBooking.date}`);
          } else {
            this.setError("This time slot is already taken. Please pick a different one.");
          }
        } else {
          this.setError("Error creating reservation. Please try again later.");
        }
      }
    });
  }
  openPlay() {
    
  }
  cancel() {
    this.cancelEvent.emit();
  }
}
