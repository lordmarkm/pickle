import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { FullCalendarModule } from '@fullcalendar/angular';
import { LandingComponent } from './landing/landing.component';
import { SidebarModule } from '../sidebar/sidebar.module';
import { CourtcalendarComponent } from '../components/courtcalendar/courtcalendar.component';

import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { SlotcontrolComponent } from './slotcontrol/slotcontrol.component';
import { EventcontrolComponent } from './eventcontrol/eventcontrol.component';
import { BookingdetailsComponent } from '../components/bookingdetails/bookingdetails.component';
import { EventselectComponent } from './dialogs/eventselect/eventselect.component';
import { SlotselectComponent } from './dialogs/slotselect/slotselect.component';
import { WelcomeComponent } from './welcome/welcome.component';

const MaterialModules = [
  MatButtonModule,
  MatTooltipModule,
  MatDialogModule
]

@NgModule({
  declarations: [
    LandingComponent,
    SlotcontrolComponent,
    EventcontrolComponent,
    EventselectComponent,
    SlotselectComponent,
    WelcomeComponent
  ],
  imports: [
    ...MaterialModules,
    CommonModule,
    LandingRoutingModule,
    FullCalendarModule,

    SidebarModule,

    //standalone components
    CourtcalendarComponent,
    BookingdetailsComponent
  ]
})
export class LandingModule { }
