import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CourtDisplayService } from '@services';
import { Court } from '@models';

@Component({
  standalone: false,
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit {
  courts: Court[] = [];
  calendarOptions: CalendarOptions = {
    initialView: 'timeGridDay',
    plugins: [timeGridPlugin]
  };

  constructor(private courtDisplay: CourtDisplayService) {}

  ngOnInit() {
    this.courtDisplay.displayedCourts$.subscribe(courts => {
      this.courts = courts;
    });
  }
}
