import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarModule } from './sidebar/sidebar.module';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SidebarModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pickle';
}
