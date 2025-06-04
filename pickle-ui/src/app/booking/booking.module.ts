import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingRoutingModule } from './booking-routing.module';
import { BookingComponent } from './booking/booking.component';
import { BookingcalendarComponent } from 'app/components/bookingcalendar/bookingcalendar.component';


@NgModule({
  declarations: [
    BookingComponent
  ],
  imports: [
    CommonModule,
    BookingRoutingModule,

    BookingcalendarComponent
  ]
})
export class BookingModule { }
