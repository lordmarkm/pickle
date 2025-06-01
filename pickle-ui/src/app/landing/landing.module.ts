import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { FullCalendarModule } from '@fullcalendar/angular';
import { LandingComponent } from './landing/landing.component';
import { HeaderModule } from '../header/header.module';

@NgModule({
  declarations: [
    LandingComponent
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
    FullCalendarModule,

    HeaderModule
  ]
})
export class LandingModule { }
