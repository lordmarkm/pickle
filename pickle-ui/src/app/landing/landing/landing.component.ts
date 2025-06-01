import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

@Component({
  standalone: false,
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  calendarOptions: CalendarOptions = {
    initialView: 'timeGridDay',
    plugins: [timeGridPlugin]
  };
}
