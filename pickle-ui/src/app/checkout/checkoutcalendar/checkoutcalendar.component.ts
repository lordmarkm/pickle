import { Component, Input, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { Booking } from '@models';
import timeGridPlugin from '@fullcalendar/timegrid';

@Component({
  selector: 'app-checkoutcalendar',
  standalone: false,
  templateUrl: './checkoutcalendar.component.html',
  styleUrl: './checkoutcalendar.component.scss'
})
export class CheckoutcalendarComponent implements OnInit {
    message?: string;
    error?: string;
    calendarOptions: CalendarOptions | null = null;
    @Input() booking!: Booking;

    constructor() {}
    ngOnInit(): void {
      const booking = this.booking;
      booking.color = booking.paid ? 'green' : '#3788d8';
      this.calendarOptions = {
        events: [ booking ],
        initialView: 'timeGridDay',
        initialDate: new Date(booking.date),
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
        },
        height: 400
      };
    }

}
