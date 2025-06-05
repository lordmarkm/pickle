import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CourtDisplayService } from '@services';
import { Court } from '@models';
import { CourtcalendarComponent } from '../../components/courtcalendar/courtcalendar.component';
import moment from 'moment';

@Component({
  standalone: false,
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit {
  courts: Court[] = [];
  date = moment().toDate();
  calendarOptions: CalendarOptions = {
    initialView: 'timeGridDay',
    plugins: [timeGridPlugin]
  };
  @ViewChildren(CourtcalendarComponent) calendars!: QueryList<CourtcalendarComponent>;

  constructor(private courtDisplay: CourtDisplayService) {}

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
}
