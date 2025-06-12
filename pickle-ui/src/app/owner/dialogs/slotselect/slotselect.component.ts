import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Booking, BookingRequest, Court } from '@models';
import { BookingService } from '@services';
import { BlockcontrolDialogComponent } from './blockcontrol/blockcontrol.component';
import { displayConstants } from 'app/misc/constants';
import { optionsDate, optionsTime } from 'app/misc/dateformats';
import { MessageComponent } from '@components';

@Component({
  standalone: false,
  selector: 'app-owner-slotselect-dialog',
  templateUrl: './slotselect.component.html',
  styleUrl: './slotselect.component.scss'
})
export class OwnerSlotselectComponent extends MessageComponent {
  booking: BookingRequest;
  court: Court;
  checkoutMessage = '';
  constructor(
    private bookings: BookingService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<OwnerSlotselectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { bookingRequest: BookingRequest; court: Court }
  ) {
    super();
    this.booking = data.bookingRequest;
    this.court = data.court;
  }
  onBookingCreatedEvent(): void {
    this.dialogRef.close();
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

    const titleDialog = this.dialog.open(BlockcontrolDialogComponent, {
      data: {
        booking: this.booking,
        court: this.court
      },
      width: displayConstants.dialogWidth
    });

    titleDialog.afterClosed().subscribe((booking: Booking) => {
      if (booking) {
        this.setMessage('Creating time slot block...');
        this.bookings.newBooking(booking).subscribe({
          next: saved => this.dialogRef.close(),
          error: err => this.setError('Failed to create time slot block. error=' + err.message)
        });
      }
    });
  }
  openPlay() {
    
  }
  cancel(): void {
    this.dialogRef.close();
  }
}
