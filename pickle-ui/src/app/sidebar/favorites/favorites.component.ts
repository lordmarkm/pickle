import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService, CourtService } from '@services';
import { filter, switchMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { Court, Master } from '@models';

@Component({
  standalone: false,
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent implements OnInit {
  favoriteCourtIds: string[] = [];
  favorites: Court[] = [];
  @Output() master = new EventEmitter<Master>(); // <-- event emitter

  constructor(private authService: AuthService, private courts: CourtService) {}

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(
        filter(user => !!user),
        switchMap(() =>
          forkJoin({
            favorites: this.courts.getFavorites(),
            master: this.courts.getMaster()
          })
        )
      )
      .subscribe({
        next: ({ favorites, master }) => {
          this.favoriteCourtIds = favorites;
          //TODO add the favorites here from master
          this.favorites = [];
          //TODO filter out the favorites
          this.master.emit(master);
        },
        error: err => console.error('Error loading court data:', err)
      });
  }

}
