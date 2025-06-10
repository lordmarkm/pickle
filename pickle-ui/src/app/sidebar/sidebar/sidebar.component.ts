import { Component, OnInit } from '@angular/core';
import { Master } from '@models';

@Component({
  standalone: false,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  master: Master | null = null;
  isCollapsed = true;
  ngOnInit(): void {
    const storedValue = localStorage.getItem('sidebar-collapsed');
    this.isCollapsed = storedValue !== null ? storedValue === 'true' : true;
  }
  afterFavoritesDisplayed($event: Master) {
    this.master = $event;
  }
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    localStorage.setItem('sidebar-collapsed', this.isCollapsed.toString());
  }
}
