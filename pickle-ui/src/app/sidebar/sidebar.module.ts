import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesComponent } from './favorites/favorites.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MasterComponent } from './master/master.component';


@NgModule({
  declarations: [
    SidebarComponent,
    FavoritesComponent,
    MasterComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SidebarComponent
  ]
})
export class SidebarModule { }
