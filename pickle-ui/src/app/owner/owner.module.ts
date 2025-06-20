import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { OwnerRoutingModule } from './owner-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OwnerComponent } from './owner/owner.component';
import { RegisterOrgDialogComponent } from './dialogs/register-org/register-org.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { OwnerSidebarComponent } from './sidebar/sidebar.component';
import { ErrorcardComponent } from '../components/errorcard/errorcard.component';
import { CourtsComponent } from './sidebar/courts/courts.component';
import { CourtcalendarComponent } from '../components/courtcalendar/courtcalendar.component';
import { RegisterCourtDialogComponent } from './dialogs/register-court/register-court.component';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { CalendarcontrolComponent } from '@components';
import { OwnerSlotselectComponent } from './dialogs/slotselect/slotselect.component';
import { BlockcontrolDialogComponent } from './dialogs/blockcontrol/blockcontrol.component';
import { OpenplaycontrolDialogComponent } from './dialogs/slotselect/openplaycontrol/openplaycontrol.component';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

const MaterialModules = [
  MatButtonModule,
  MatIconModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatCardModule,
  MatCheckboxModule,
  MatListModule
];

@NgModule({
  declarations: [
    DashboardComponent,
    OwnerComponent,
    RegisterOrgDialogComponent,
    OwnerSidebarComponent,
    CourtsComponent,
    RegisterCourtDialogComponent,
    OwnerSlotselectComponent,
    BlockcontrolDialogComponent,
    OpenplaycontrolDialogComponent
  ],
  imports: [
    ...MaterialModules,
    CommonModule,
    OwnerRoutingModule,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule,
    NgxMatTimepickerModule,

    //standalones
    ErrorcardComponent,
    CourtcalendarComponent,
    CalendarcontrolComponent
  ]
})
export class OwnerModule { }
