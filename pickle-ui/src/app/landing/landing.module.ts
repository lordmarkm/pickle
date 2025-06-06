import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { FullCalendarModule } from '@fullcalendar/angular';
import { LandingComponent } from './landing/landing.component';
import { SidebarModule } from '../sidebar/sidebar.module';
import { CourtcalendarComponent } from '../components/courtcalendar/courtcalendar.component';

import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SlotcontrolComponent } from './slotcontrol/slotcontrol.component';
import { EventcontrolComponent } from './eventcontrol/eventcontrol.component';
import { BookingdetailsComponent } from '../components/bookingdetails/bookingdetails.component';

const MaterialModules = [
  MatButtonModule,
  MatTooltipModule
]

@NgModule({
  declarations: [
    LandingComponent,
    SlotcontrolComponent,
    EventcontrolComponent,
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
