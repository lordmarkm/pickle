import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import { BookingService, CourtDisplayService } from '@services';
import { BookingRequest, Court, MasterCourt, Booking } from '@models';
import { CourtcalendarComponent } from '../../components/courtcalendar/courtcalendar.component';
import moment from 'moment';
import { MessageComponent } from 'app/components/message.component';
import { Router } from '@angular/router';
import { fadeIn, fadeInOut } from 'app/misc/animations';
import { Observable } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  animations: [ fadeInOut, fadeIn]
})
export class LandingComponent extends MessageComponent implements OnInit {
  courts$: Observable<MasterCourt[]> | null = null;
  date = moment().toDate();
  calendarOptions: CalendarOptions = {
    initialView: 'timeGridDay',
    plugins: [timeGridPlugin]
  };
  @ViewChildren(CourtcalendarComponent) calendars!: QueryList<CourtcalendarComponent>;
  booking?: Booking;
  bookingRequest: BookingRequest | null = null;
  court: Court | null = null;
  checkoutMessage?: string;
  selectionType?: 'slot' | 'event';

  constructor(private courtDisplay: CourtDisplayService, private bookings: BookingService, private router: Router) {
    super();
  }

  ngOnInit() {
    this.courts$ = this.courtDisplay.displayedCourts$;
  }
  today() {
    this.calendars.forEach(c => c.today());
    this.date = moment().toDate();
  }
  previousDay() {
    this.calendars.forEach(c => c.previousDay());
    this.date = moment(this.date).subtract(1, 'days').toDate();
  }
  nextDay() {
    this.calendars.forEach(c => c.nextDay());
    this.date = moment(this.date).add(1, 'days').toDate();
  }
  onSlotSelected(court: Court, bookingRequest: BookingRequest) {
    this.bookingRequest = bookingRequest;
    this.court = court;
    this.selectionType = 'slot';
  }
  onEventSelected(court: Court, booking: Booking) {
    this.booking = booking;
    this.court = court;
    this.selectionType = 'event';
  }
  cancel() {
    delete this.booking;
    this.bookingRequest = null;
    this.court = null;
  }
}
