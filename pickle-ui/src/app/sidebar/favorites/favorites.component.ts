import { Component, OnInit } from '@angular/core';
import { AuthService, CourtService } from '@services';
import { filter, switchMap } from 'rxjs/operators';

@Component({
  standalone: false,
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent implements OnInit {
  favoriteCourtIds: string[] = [];

  constructor(private authService: AuthService, private courts: CourtService) {}

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(
        filter(user => !!user), // only continue if user is not null
        switchMap(() => this.courts.getFavorites())
      )
      .subscribe({
        next: favs => this.favoriteCourtIds = favs,
        error: err => console.error('Error loading favorites:', err)
      });  
  }

}
