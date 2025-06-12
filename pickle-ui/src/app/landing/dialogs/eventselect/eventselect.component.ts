import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Booking, MasterCourt } from '@models';

@Component({
  standalone: false,
  selector: 'app-eventselect-dialog',
  templateUrl: './eventselect.component.html',
  styleUrl: './eventselect.component.scss'
})
export class EventselectComponent {
  booking: Booking;
  court: MasterCourt;
  constructor(
    public dialogRef: MatDialogRef<EventselectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { booking: Booking; court: MasterCourt }
  ) {
    this.booking = data.booking;
    this.court = data.court;
  }
  cancel(): void {
    this.dialogRef.close();
  }
}
