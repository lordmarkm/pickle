import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { FullCalendarModule } from '@fullcalendar/angular';
import { LandingComponent } from './landing/landing.component';
import { SidebarModule } from '../sidebar/sidebar.module';
import { CourtcalendarComponent } from '../components/courtcalendar/courtcalendar.component';

import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

const MaterialModules = [
  MatButtonModule,
  MatTooltipModule
]

@NgModule({
  declarations: [
    LandingComponent
  ],
  imports: [
    ...MaterialModules,
    CommonModule,
    LandingRoutingModule,
    FullCalendarModule,

    SidebarModule,

    //standalone components
    CourtcalendarComponent
  ]
})
export class LandingModule { }
