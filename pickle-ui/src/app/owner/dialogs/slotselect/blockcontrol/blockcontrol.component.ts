import { Inject, Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Booking, MasterCourt } from '@models';
import { timedateFormats } from 'app/misc/constants';
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
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BlockcontrolDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) private data: { booking: Booking, court: MasterCourt }) {

    const booking = data.booking;
    this.form = this.fb.group({
      title: ['Private Event', [Validators.required, Validators.maxLength(20), Validators.minLength(4)]],
      type: 'Block',
      start: moment(booking.start, timedateFormats.calendarTime).format('h:mm a'),
      end: moment(booking.end, timedateFormats.calendarTime).format('h:mm a'),
      court: data.court.name
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
  submit() {
    if (this.form.valid) {
      const booking: Booking = this.form.value;
      this.dialogRef.close(this.form.value);
    }
  }
  get titleCtrl() {
    return this.form.get('title');
  }
}
