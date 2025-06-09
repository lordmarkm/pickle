import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

const MaterialModules = [
  MatMenuModule,
  MatButtonModule,
  MatIconModule
]

@NgModule({
  declarations: [
    LoginComponent,
    HeaderComponent
  ],
  imports: [
    ...MaterialModules,
    CommonModule,
    RouterModule
  ],
  exports: [
    HeaderComponent
  ]
})
export class HeaderModule { }
