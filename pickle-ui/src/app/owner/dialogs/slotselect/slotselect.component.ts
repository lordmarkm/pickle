import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BookingRequest, Court } from '@models';

@Component({
  standalone: false,
  selector: 'app-owner-slotselect-dialog',
  templateUrl: './slotselect.component.html',
  styleUrl: './slotselect.component.scss'
})
export class OwnerSlotselectComponent {
  bookingRequest: BookingRequest;
  court: Court;
  constructor(
    public dialogRef: MatDialogRef<OwnerSlotselectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { bookingRequest: BookingRequest; court: Court }
  ) {
    this.bookingRequest = data.bookingRequest;
    this.court = data.court;
  }
  onBookingCreatedEvent(): void {
    this.dialogRef.close();
  }
  cancel(): void {
    this.dialogRef.close();
  }
}
