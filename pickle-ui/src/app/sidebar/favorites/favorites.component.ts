import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService, CourtService, CourtDisplayService } from '@services';
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
  @Output() master = new EventEmitter<Master>();
  checkedFavorites = new Set<string>();

  constructor(private authService: AuthService, private courts: CourtService, private courtDisplay: CourtDisplayService) {}

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
    
        // Clone orgs deeply to avoid mutating original `master.orgs`
        const clonedOrgs = master.orgs.map(org => ({
          ...org,
          courts: [...org.courts]
        }));
    
        // Filter and separate favorites
        const filteredOrgs = clonedOrgs.filter(org => {
          const favoriteCourtsInOrg = org.courts.filter(court => this.favoriteCourtIds.includes(court.id));
          const nonFavoriteCourtsInOrg = org.courts.filter(court => !this.favoriteCourtIds.includes(court.id));
    
          this.favorites.push(...favoriteCourtsInOrg);
          org.courts = nonFavoriteCourtsInOrg;
    
          return org.courts.length > 0;
        });
    
        // Emit a new master object with filtered orgs
        this.master.emit({
          ...master,
          orgs: filteredOrgs
        });
    
        this.loadCheckedFavorites();
      },
      error: err => console.error('Error loading court data:', err)
    });

    //reload favorites if modified
    this.courts.favoritesModified$.subscribe(() => {
      this.loadCheckedFavorites();
    });
  }

  onCheckUncheck(court: MasterCourt, evt: Event) {
    const checked = (evt.target as HTMLInputElement).checked;
    if (checked) {
        this.courtDisplay.addDisplayedCourt(court);
        this.checkedFavorites.add(court.id);
    } else {
        this.courtDisplay.removeDisplayedCourt(court);
        this.checkedFavorites.delete(court.id);
    }
    court.checked = checked;
    this.saveCheckedFavorites();
  }
  saveCheckedFavorites() {
    localStorage.setItem(
      'checkedFavorites',
      JSON.stringify(Array.from(this.checkedFavorites))
    );
  }
  loadCheckedFavorites() {
    const data = localStorage.getItem('checkedFavorites');
    if (data) {
      this.checkedFavorites = new Set(JSON.parse(data));
    }
    for (const courtId of this.checkedFavorites) {
      this.courts.findOne(courtId).subscribe(court => {
        if (court) {
          this.courtDisplay.addDisplayedCourt(court);
          court.checked = true;
        } else {
          console.log('deleting nonexistent court from checked favorites');
          this.checkedFavorites.delete(courtId);
        }
      });
    }
    for (const court of this.favorites) {
      court.checked = this.checkedFavorites.has(court.id);
    }
  }
}
