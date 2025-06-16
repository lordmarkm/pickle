import { Inject, Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Booking, MasterCourt } from '@models';
import { timedateFormats } from 'app/misc/constants';
import { dateFormat, dateTimeFormat, simpleTimeFormat } from 'app/misc/dateformats';
import moment from 'moment';

@Component({
  selector: 'app-blockcontrol',
  standalone: false,
  templateUrl: './blockcontrol.component.html',
  styleUrl: './blockcontrol.component.scss'
})
export class BlockcontrolDialogComponent implements AfterViewInit {
  form: FormGroup;
  @ViewChild('titleInput') titleInput!: ElementRef<HTMLInputElement>;
  booking: any;
  existingBooking = false;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BlockcontrolDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) private data: { booking: Booking, court: MasterCourt }) {

    this.booking = data.booking;
    this.existingBooking = this.booking.id;
    console.log(this.booking);
    this.form = this.fb.group({
      title: ['Private Event', [Validators.required, Validators.maxLength(20), Validators.minLength(4)]],
      type: 'Block',
      startStr: moment(this.booking.start, dateTimeFormat).format(simpleTimeFormat),
      endStr: moment(this.booking.end, dateTimeFormat).format(simpleTimeFormat),
      court: data.court.name,
      courtId: data.court.id,
      date: moment(this.booking.end, timedateFormats.calendarTime).format(dateFormat)
    });
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.titleInput.nativeElement.focus();
      this.titleInput.nativeElement.select();
    });
  }
  cancel() {
    this.dialogRef.close();
  }
  delete() {
    this.booking.deleted = true;
    this.dialogRef.close(this.booking);
  }
  submit() {
    if (this.form.valid) {
      const booking: Booking = this.form.value;
      booking.start = moment(this.booking.start).toISOString();
      booking.end = moment(this.booking.end).toISOString();
      if (this.booking.id) {
        booking.id = this.booking.id;
      }
      this.dialogRef.close(booking);
    }
  }
  get titleCtrl() {
    return this.form.get('title');
  }
}
