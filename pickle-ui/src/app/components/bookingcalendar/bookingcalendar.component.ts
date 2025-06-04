import { Component, Input, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import { Booking } from '@models';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CommonModule } from '@angular/common';
import { MessageComponent } from '../message.component';
import moment from 'moment';

@Component({
  standalone: true,
  selector: 'app-bookingcalendar',
  imports: [ CommonModule, FullCalendarModule ],
  templateUrl: './bookingcalendar.component.html',
  styleUrl: './bookingcalendar.component.scss'
})
export class BookingcalendarComponent extends MessageComponent implements OnInit {
    calendarOptions: CalendarOptions | null = null;
    @Input() booking!: Booking;

    constructor() {
      super();
    }
    ngOnInit(): void {
      const booking = this.booking;
      booking.color = booking.paid ? 'green' : 'blue';
      this.calendarOptions = {
        events: [ booking ],
        initialDate: moment(booking.date).toDate(),
        initialView: 'timeGridDay',
        allDaySlot: false,
        plugins: [ timeGridPlugin ],
        selectable: true,
        selectMirror: true,
        slotMinTime: '16:00:00',
        slotMaxTime: '22:00:00',
        slotDuration: '01:00:00',
        headerToolbar: {
          start: 'title',
          center: '',
          end: ''
        }
      };
    }
}
