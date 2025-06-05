import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { FullCalendarModule } from '@fullcalendar/angular';
import { LandingComponent } from './landing/landing.component';
import { SidebarModule } from '../sidebar/sidebar.module';
import { CourtcalendarComponent } from '../components/courtcalendar/courtcalendar.component';

@NgModule({
  declarations: [
    LandingComponent
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
    FullCalendarModule,

    SidebarModule,

    //standalone components
    CourtcalendarComponent
  ]
})
export class LandingModule { }
