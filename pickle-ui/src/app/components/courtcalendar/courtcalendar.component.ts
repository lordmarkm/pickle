import { Component, Input, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MasterCourt, Bookings, Booking, BookingRequest, EventColors } from '@models';
import { BookingService, CourtService, AuthService } from '@services';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, Calendar, EventClickArg } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventApi } from '@fullcalendar/core';
import moment from 'moment';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter, take, switchMap, tap } from 'rxjs/operators';
import { dateFormat, dateTimeFormat, simpleTimeFormat, fcTimeFormat } from '../../misc/dateformats';
import { CourtDisplayService } from '../../services/courtdisplay.service';

@Component({
  standalone: true,
  selector: 'app-courtcalendar',
  templateUrl: './courtcalendar.component.html',
  styleUrl: './courtcalendar.component.scss',
  imports: [ CommonModule, FullCalendarModule, MatTooltipModule ]
})
export class CourtcalendarComponent implements OnInit {
  @ViewChild('fullcalendar') calendarComponent!: FullCalendarComponent;
  calendarApi!: Calendar;
  date: Date | null = null;
  @Input() court!: MasterCourt;
  message: string | null = null;
  error: string | null = null;
  calendarOptions: CalendarOptions | null = null;
  @Output() slotSelected = new EventEmitter<any>();
  @Output() eventSelected = new EventEmitter<any>();
  favorite = false;
  spinning = false;
  schedStart?: string;
  schedEnd?: string;
  anonymous = true;

  constructor(private router: Router, private bookings: BookingService, private courts: CourtService, private auth: AuthService, private courtDisplayService: CourtDisplayService) {}
  ngOnInit() {
    this.loadEvents();
    this.auth.currentUser$.pipe(
      tap(user => this.anonymous = !user),
      filter(user => !!user),
      switchMap(() => this.courts.isFavorite(this.court.id))
    ).subscribe(favorite => {
      this.favorite = favorite;
    });
    this.courtDisplayService.refreshEvents$.subscribe(courtId => {
      if (courtId === this.court.id) {
        this.loadEvents();
      } else {
        //console.log(`ignoring refresh event. evt id=${courtId}, my court id=${this.court.id}`)
      }
    });
    this.schedStart = moment(this.court.start || '16:00:00', fcTimeFormat).format(simpleTimeFormat);
    this.schedEnd = moment(this.court.end || '22:00:00', fcTimeFormat).format(simpleTimeFormat);
  }
  loadEvents() {
    const date = this.date ?? new Date();
    this.bookings.getBookings(this.court.id, moment(date).format(dateFormat)).subscribe((bookings: Bookings) => {
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
        initialDate: date,
        allDaySlot: false,
        plugins: [ interactionPlugin, timeGridPlugin ],
        selectable: true,
        selectMirror: true,
        slotMinTime: this.court.start ?? '16:00:00',
        slotMaxTime: this.court.end ?? '22:00:00',
        slotDuration: '01:00:00',
        select: this.handleSelect.bind(this),
        unselect: () => {
          this.message = null;
        },
        headerToolbar: {
            left: '',
            center: '',
            right: ''
        },
        eventClick: this.handleEventClick.bind(this)
      };
      setTimeout(() => {
        this.calendarApi = this.calendarComponent.getApi();
        this.date = this.calendarApi.getDate();
      }, 100);
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
      this.error = null;
      const booking: BookingRequest = {
        start: start,
        end: end
      }
      this.slotSelected.emit(booking);
    }
  }
  handleEventClick(selectionInfo: EventClickArg) {
    const evt = selectionInfo.event;
    const ep = evt.extendedProps;
    const booking: Booking = {
      id: evt.id,
      courtId: ep['courtId'],
      date: moment(evt.start).format(dateFormat),
      start: moment(evt.start).format(dateTimeFormat),
      end: moment(evt.end).format(dateTimeFormat),
      title: evt.title,
      type: ep['type'],
      paid: ep['paid'],
      createdBy: ep['createdBy'],
      createdDate: ep['createdDate']
    };
    this.eventSelected.emit(booking);
  }
  setMessage(msg: string) {
    this.error = null;
    this.message = msg;
  }
  setError(err: string) {
    this.message = null;
    this.error = err;
  }
  setDate(date: Date) {
    this.calendarApi.gotoDate(date);
    this.date = this.calendarApi.getDate();
    this.loadEvents();
  }
  addToFavorites() {
   this.spinning = true;
   setTimeout(() => {
    this.spinning = false;
   }, 300)
   this.favorite = true; 
   this.courts.addFavoriteCourt(this.court.id).subscribe({
     next: res => this.setMessage(res.message),
     error: err => this.setError('Failed to add favorite: ' + err.message)
   });
  }
  removeFromFavorites() {
   this.favorite = false;
   this.courts.removeFavoriteCourt(this.court.id).subscribe({
     next: res => this.setMessage(res.message),
     error: err => this.setError('Failed to remove favorite: ' + err.message)
   });
  }
}
