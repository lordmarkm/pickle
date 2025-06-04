import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FullCalendarModule } from '@fullcalendar/angular';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './checkout/checkout.component';
import { CheckoutcalendarComponent } from './checkoutcalendar/checkoutcalendar.component';


@NgModule({
  declarations: [
    CheckoutComponent,
    CheckoutcalendarComponent
  ],
  imports: [
    CommonModule,
    FullCalendarModule,
    CheckoutRoutingModule
  ]
})
export class CheckoutModule { }
