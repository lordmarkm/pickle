import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { AuthService, CourtService, CourtDisplayService } from '@services';
import { filter, tap, takeUntil } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';
import { MasterCourt, Master, MasterOrg } from '@models';

@Component({
  standalone: false,
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent implements OnInit, OnDestroy {
  favoriteCourtIds: string[] = [];
  favorites: MasterCourt[] = [];
  @Output() master = new EventEmitter<Master>();
  checkedFavorites = new Set<string>();
  anonymous = true;

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private courts: CourtService,
    private courtDisplay: CourtDisplayService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(
        tap(user => {
          if (!user) {
            this.handleNoUser();
          }
        }),
        filter(user => !!user),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.loadCourtDataForUser();
      });

    this.courts.favoritesModified$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadCourtDataForUser();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private handleNoUser(): void {
    this.favorites = [];
    this.favoriteCourtIds = [];
    this.anonymous = true;
    this.courts.getMaster()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: completeMaster => this.master.emit(completeMaster),
        error: err => console.error('Could not load master for anonymous user')
      });
  }

  private loadCourtDataForUser(): void {
    this.anonymous = false;

    forkJoin({
      favorites: this.courts.getFavorites(true),
      master: this.courts.getMaster()
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ favorites, master }) => this.handleUserCourtData(favorites, master),
        error: err => console.error('Error loading court data:', err)
      });
  }

  private handleUserCourtData(favorites: any, master: any, refreshFavorites = true): void {
    this.favoriteCourtIds = favorites.courts;
    this.favorites = [];

    const clonedOrgs = master.orgs.map((org: MasterOrg) => ({
      ...org,
      courts: [...org.courts]
    }));

    const filteredOrgs = clonedOrgs.filter((org: MasterOrg) => {
      const favoriteCourtsInOrg = org.courts.filter(court => this.favoriteCourtIds.includes(court.id));
      const nonFavoriteCourtsInOrg = org.courts.filter(court => !this.favoriteCourtIds.includes(court.id));

      this.favorites.push(...favoriteCourtsInOrg);
      org.courts = nonFavoriteCourtsInOrg;

      return org.courts.length > 0;
    });

    this.master.emit({
      ...master,
      orgs: filteredOrgs
    });

    if (refreshFavorites) {
      this.refreshFavorites();
    }
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

  refreshFavorites() {
    const data = localStorage.getItem('checkedFavorites');
    if (data) {
      this.checkedFavorites = new Set(JSON.parse(data));
    }
    for (const courtId of this.checkedFavorites) {
      this.courts.findOne(courtId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(court => {
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
