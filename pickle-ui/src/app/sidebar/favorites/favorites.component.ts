import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService, CourtService } from '@services';
import { filter, switchMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { MasterCourt, Master } from '@models';

@Component({
  standalone: false,
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent implements OnInit {
  favoriteCourtIds: string[] = [];
  favorites: MasterCourt[] = [];
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
          this.favoriteCourtIds = favorites.courts;
          this.favorites = [];
          master.orgs = master.orgs.filter(org => {
            const favoriteCourtsInOrg = org.courts.filter(court => this.favoriteCourtIds.includes(court.id));
            const nonFavoriteCourtsInOrg = org.courts.filter(court => !this.favoriteCourtIds.includes(court.id));

            // Add favorite courts to this.favorites
            this.favorites.push(...favoriteCourtsInOrg);

            // Update org's courts to only non-favorites
            org.courts = nonFavoriteCourtsInOrg;

            // Keep the org only if it still has courts after removing favorites
            return org.courts.length > 0;
          });
          this.master.emit(master);
        },
        error: err => console.error('Error loading court data:', err)
      });
  }

}
