import { Component, EventEmitter, Output } from '@angular/core';
import moment from 'moment';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-calendarcontrol',
  imports: [ CommonModule, MatButtonModule ],
  templateUrl: './calendarcontrol.component.html',
  styleUrls: ['./calendarcontrol.component.scss']  // Note: `styleUrls`, not `styleUrl`
})
export class CalendarcontrolComponent {
  date = moment().toDate();
  atCurrentDate = true;

  @Output() dateControl = new EventEmitter<{ date: Date, atCurrentDate: boolean }>();

  constructor() {
    this.emitDateControl();
  }

  today() {
    this.date = moment().toDate();
    this.atCurrentDate = true;
    this.emitDateControl();
  }

  previousDay() {
    const date = moment(this.date).subtract(1, 'days');
    if (date.isBefore(moment().startOf('day'))) {
      return;
    }
    this.date = date.toDate();
    this.atCurrentDate = date.isSame(moment(), 'day');
    this.emitDateControl();
  }

  nextDay() {
    const date = moment(this.date).add(1, 'days');
    this.date = date.toDate();
    this.atCurrentDate = date.isSame(moment(), 'day');
    this.emitDateControl();
  }

  private emitDateControl() {
    this.dateControl.emit({ date: this.date, atCurrentDate: this.atCurrentDate });
  }
}
