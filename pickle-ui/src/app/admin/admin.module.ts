import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { CourtsettingsComponent } from './dialogs/courtsettings/courtsettings.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';

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
    CourtsettingsComponent
  ],
  imports: [
    ...MaterialModules,
    CommonModule,
    AdminRoutingModule
  ],
  exports: [
    CourtsettingsComponent
  ]
})
export class AdminModule { }
