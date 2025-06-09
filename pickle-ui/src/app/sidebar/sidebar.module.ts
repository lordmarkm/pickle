import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesComponent } from './favorites/favorites.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MasterComponent } from './master/master.component';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';

const MaterialModules = [
  MatListModule,
  MatCheckboxModule
]

@NgModule({
  declarations: [
    SidebarComponent,
    FavoritesComponent,
    MasterComponent
  ],
  imports: [
    ...MaterialModules,
    CommonModule
  ],
  exports: [
    SidebarComponent
  ]
})
export class SidebarModule { }
