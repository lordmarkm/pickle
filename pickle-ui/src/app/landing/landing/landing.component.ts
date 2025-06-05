import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import { BookingService, CourtDisplayService } from '@services';
import { BookingRequest, Court } from '@models';
import { CourtcalendarComponent } from '../../components/courtcalendar/courtcalendar.component';
import moment from 'moment';
import { MessageComponent } from 'app/components/message.component';
import { Router } from '@angular/router';
import { fadeIn, fadeInOut } from 'app/misc/animations';

const optionsTime: Intl.DateTimeFormatOptions = { hour: 'numeric', hour12: true };
const optionsDate: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
const dateFormat = 'YYYY-MMM-DD';
const dateTimeFormat = 'YYYY-MM-DDTHH:mm:ss';

@Component({
  standalone: false,
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  animations: [ fadeInOut, fadeIn]
})
export class LandingComponent extends MessageComponent implements OnInit {
  courts: Court[] = [];
  date = moment().toDate();
  calendarOptions: CalendarOptions = {
    initialView: 'timeGridDay',
    plugins: [timeGridPlugin]
  };
  @ViewChildren(CourtcalendarComponent) calendars!: QueryList<CourtcalendarComponent>;
  booking: BookingRequest | null = null;
  court: Court | null = null;
  checkoutMessage?: string;

  constructor(private courtDisplay: CourtDisplayService, private bookings: BookingService, private router: Router) {
    super();
  }

  ngOnInit() {
    this.courtDisplay.displayedCourts$.subscribe(courts => {
      this.courts = courts;
    });
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

  onSlotSelected(court: Court, booking: BookingRequest) {
    const startTime = booking.start.toLocaleTimeString('en-PH', optionsTime);
    const endTime = booking.end.toLocaleTimeString('en-PH', optionsTime);
    const date = booking.end.toLocaleDateString('en-PH', optionsDate);
    this.court = court;
    this.booking = booking;
    this.checkoutMessage = `Selected slot is available! From ${startTime} to ${endTime} on ${date} @ ${this.court?.org} ${this.court?.name}`;
  }

  //todo protect w/ captcha
  checkout() {
    if (!this.booking || !this.court) {
      this.setError("Booking or Court not found");
      return;
    }
    this.setMessage('Creating reservation...');
    const start = moment(this.booking.start).format(dateTimeFormat);
    const end = moment(this.booking.end).format(dateTimeFormat);
    const date = moment(this.booking.end).format(dateFormat);
    this.bookings.newBooking(this.court.id, date, start, end).subscribe(res => {
      console.log('booking success. res: ', res);
      //send to payment page here
      this.router.navigate(['/checkout'], {queryParams: {bookingId: res.id}});
    }, err => {
        this.setError('Error creating reservation. Please try again later');
    });
  }
  cancel() {
    this.booking = null;
    this.court = null;
  }
}
