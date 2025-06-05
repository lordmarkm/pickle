import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FullCalendarModule } from '@fullcalendar/angular';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './checkout/checkout.component';
import { CheckoutcalendarComponent } from './checkoutcalendar/checkoutcalendar.component';

import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

const MaterialModules = [
  MatButtonModule,
  MatTooltipModule
]

@NgModule({
  declarations: [
    CheckoutComponent,
    CheckoutcalendarComponent
  ],
  imports: [
    ...MaterialModules,
    CommonModule,
    FullCalendarModule,
    CheckoutRoutingModule
  ]
})
export class CheckoutModule { }
