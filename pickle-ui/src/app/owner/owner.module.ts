import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OwnerRoutingModule } from './owner-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OwnerComponent } from './owner/owner.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { RegisterOrgDialogComponent } from './dialogs/register-org/register-org.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

const MaterialModules = [
  MatButtonModule,
  MatIconModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule
];

@NgModule({
  declarations: [
    DashboardComponent,
    OwnerComponent,
    RegisterOrgDialogComponent
  ],
  imports: [
    ...MaterialModules,
    CommonModule,
    OwnerRoutingModule,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule
  ]
})
export class OwnerModule { }
