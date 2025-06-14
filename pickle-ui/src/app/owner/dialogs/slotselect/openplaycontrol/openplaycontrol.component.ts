import { Inject, Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Booking, MasterCourt } from '@models';
import { timedateFormats } from 'app/misc/constants';
import { dateFormat, simpleTimeFormat } from 'app/misc/dateformats';
import moment from 'moment';

@Component({
  selector: 'app-openplaycontrol',
  standalone: false,
  templateUrl: './openplaycontrol.component.html',
  styleUrl: './openplaycontrol.component.scss'
})
export class OpenplaycontrolDialogComponent implements AfterViewInit {
  form: FormGroup;
  @ViewChild('maxPlayersInput') maxPlayersInput!: ElementRef<HTMLInputElement>;
  booking: any;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<OpenplaycontrolDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) private data: { booking: Booking, court: MasterCourt }) {

    this.booking = data.booking;
    console.log(this.booking);
    this.form = this.fb.group({
      title: ['Open Play', [Validators.required, Validators.maxLength(20), Validators.minLength(4)]],
      maxPlayers: [20, [Validators.required, Validators.min(4), Validators.max(100)]],
      type: 'Open Play',
      startStr: moment(this.booking.start, timedateFormats.calendarTime).format(simpleTimeFormat),
      endStr: moment(this.booking.end, timedateFormats.calendarTime).format(simpleTimeFormat),
      court: data.court.name,
      courtId: data.court.id,
      date: moment(this.booking.end, timedateFormats.calendarTime).format(dateFormat)
    });
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.maxPlayersInput.nativeElement.focus();
      this.maxPlayersInput.nativeElement.select();
    });
  }
  cancel() {
    this.dialogRef.close();
  }
  submit() {
    if (this.form.valid) {
      const booking: Booking = this.form.value;
      booking.start = this.booking.start.toISOString();
      booking.end = this.booking.end.toISOString();
      this.dialogRef.close(booking);
    }
  }
  get titleCtrl() {
    return this.form.get('title');
  }
  get maxPlayers() {
    return this.form.get('maxPlayers');
  }
}
