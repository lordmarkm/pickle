import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OwnerRoutingModule } from './owner-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OwnerComponent } from './owner/owner.component';


@NgModule({
  declarations: [
    DashboardComponent,
    OwnerComponent
  ],
  imports: [
    CommonModule,
    OwnerRoutingModule
  ]
})
export class OwnerModule { }
