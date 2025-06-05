import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MasterCourt, Bookings, EventColors } from '@models';

import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventApi } from '@fullcalendar/core';
import { BookingService } from '@services';
import moment from 'moment';

const optionsTime: Intl.DateTimeFormatOptions = { hour: 'numeric', hour12: true };
const optionsDate: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
const dateFormat = 'YYYY-MMM-DD';
const dateTimeFormat = 'YYYY-MM-DDTHH:mm:ss';

@Component({
  standalone: true,
  selector: 'app-courtcalendar',
  templateUrl: './courtcalendar.component.html',
  styleUrl: './courtcalendar.component.scss',
  imports: [ CommonModule, FullCalendarModule ]
})
export class CourtcalendarComponent implements OnInit {
  
  @Input() court!: MasterCourt;
  message: string | null = null;
  error: string | null = null;
  calendarOptions: CalendarOptions | null = null;
  start: Date | null = null;
  end: Date | null = null;

  constructor(private router: Router, private bookings: BookingService) {}
  ngOnInit() {
    this.loadEvents();
  }
  loadEvents() {
    this.bookings.getBookings(this.court.id, moment().format(dateFormat)).subscribe((bookings: Bookings) => {
      bookings.bookings.forEach(booking => {
        if (booking.paid) {
            booking.color = EventColors.paid;
        } else {
            booking.color = EventColors.booked;
        }
      });
      this.calendarOptions = {
        events: bookings.bookings,
        initialView: 'timeGridDay',
        allDaySlot: false,
        plugins: [ interactionPlugin, timeGridPlugin ],
        selectable: true,
        selectMirror: true,
        slotMinTime: '16:00:00',
        slotMaxTime: '22:00:00',
        slotDuration: '01:00:00',
        select: this.handleSelect.bind(this),
        unselect: () => {
          //do nothing?
        }
      };
    });
  }
  handleSelect(selectionInfo: DateSelectArg) {
    const calendarApi = selectionInfo.view.calendar;
    const start = selectionInfo.start;
    const end = selectionInfo.end;

    const events = calendarApi.getEvents();

    const hasOverlap = events.some((event: EventApi) => {
      const eventStart = event.start!;
      const eventEnd = event.end ?? event.start!;
      return (start < eventEnd) && (end > eventStart);
    });

    if (hasOverlap) {
      calendarApi.unselect();
      this.message = null;
      this.error = 'Sorry that time slot is not available.';
    } else {
      console.log('Selected slot is available:', start, 'to', end);
      this.start = start;
      this.end = end;
      const startTime = start.toLocaleTimeString('en-PH', optionsTime);
      const endTime = end.toLocaleTimeString('en-PH', optionsTime);
      const date = end.toLocaleDateString('en-PH', optionsDate);
      this.message = `Selected slot is available! From ${startTime} to ${endTime} on ${date}. Book now`;
      this.error = null;
      // your custom logic here
    }
  }
  //this should through checkout and payment first
  book() {
    if (null == this.start || null == this.end || null == this.court) {
      this.error = "something is null";
    }
    const start = moment(this.start).format(dateTimeFormat);
    const end = moment(this.end).format(dateTimeFormat);
    const date = moment(this.end).format(dateFormat);
    this.bookings.newBooking(this.court.id, date, start, end).subscribe(res => {
      console.log('booking success. res: ', res);
    });
  }
  //todo protect w/ captcha
  checkout() {
    if (null == this.start || null == this.end || null == this.court) {
      this.error = "something is null";
    }
    this.setMessage('Creating reservation...');
    const start = moment(this.start).format(dateTimeFormat);
    const end = moment(this.end).format(dateTimeFormat);
    const date = moment(this.end).format(dateFormat);
    this.bookings.newBooking(this.court.id, date, start, end).subscribe(res => {
      console.log('booking success. res: ', res);
      //send to payment page here
      this.router.navigate(['/checkout'], {queryParams: {bookingId: res.id}});
    }, err => {
        this.setError('Error creating reservation. Please try again later');
    });
  }
  setMessage(msg: string) {
    this.error = null;
    this.message = msg;
  }
  setError(err: string) {
    this.message = null;
    this.error = err;
  }
}
