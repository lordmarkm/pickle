import { Component } from '@angular/core';
import { Court, Master } from '@models';

@Component({
  standalone: false,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  master: Master | null = null;
  afterFavoritesDisplayed($event: Master) {
    this.master = $event;
  }
}
