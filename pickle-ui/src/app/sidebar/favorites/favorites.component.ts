import { Component } from '@angular/core';
import { AuthService } from '@services';

@Component({
  standalone: false,
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent {

  constructor(private authService: AuthService) {}

}
