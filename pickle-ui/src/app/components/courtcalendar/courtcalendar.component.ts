import { Component, Input } from '@angular/core';
import { MasterCourt } from '@models';

import { FullCalendarModule } from '@fullcalendar/angular';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CalendarOptions } from '@fullcalendar/core';

@Component({
  standalone: true,
  selector: 'app-courtcalendar',
  templateUrl: './courtcalendar.component.html',
  styleUrl: './courtcalendar.component.scss',
  imports: [ FullCalendarModule ]
})
export class CourtcalendarComponent {

  @Input() court!: MasterCourt;
  calendarOptions: CalendarOptions = {
    initialView: 'timeGridDay',
    plugins: [timeGridPlugin]
  };
}
