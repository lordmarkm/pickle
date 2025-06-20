import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable, of, Subject } from 'rxjs';
import { map, tap, finalize, shareReplay } from 'rxjs/operators';
import { Master, MasterCourt, Court } from '@models';
import { localStorageNames } from 'app/misc/constants';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CourtService {
  private baseUrl = `${environment.functions.baseUrl}/courts`;
  private favoritesCache: any | null = null;
  private favoritesRequest$: Observable<any> | null = null;
  private masterCache: Master | null = null;
  private masterRequest$: Observable<Master> | null = null;
  private favoritesModified = new Subject<void>();
  favoritesModified$ = this.favoritesModified.asObservable();

  constructor(private http: HttpClient) {}

  findOne(courtId: string): Observable<MasterCourt | undefined> {
    return this.getMaster().pipe(
      map(master => {
        for (const org of master.orgs) {
          const court = org.courts.find(c => c.id === courtId);
          if (court) {
            return court;
          }
        }
        return undefined;
      })
    );
  }

  findByOrg(orgId: string): Observable<{ courts: Court[] }> {
    return this.http.get<{ courts: Court[] }>(`${this.baseUrl}/org/${orgId}`);
  }

  getFavorites(refresh = false): Observable<any> {
    // Return the cached value if available
    if (this.favoritesCache && !refresh) {
      return of(this.favoritesCache);
    }
  
    // Return the in-flight request if already ongoing
    if (this.favoritesRequest$) {
      return this.favoritesRequest$;
    }
  
    // No cache or in-flight request: make HTTP call and store the observable
    this.favoritesRequest$ = this.http.get<any>(`${this.baseUrl}/favorites`).pipe(
      tap(favorites => {
        this.favoritesCache = favorites;
      }),
      finalize(() => {
        // Clear the in-flight request when done (success or error)
        this.favoritesRequest$ = null;
      }),
      shareReplay(1) // Share result with all subscribers and replay the last emitted value
    );
  
    return this.favoritesRequest$;
  }

  isFavorite(courtId: string): Observable<boolean> {
    return this.getFavorites().pipe(
      map(favorites => {
        return favorites.courts.includes(courtId);
      })
    );
  }

  getMaster(): Observable<Master> {
    if (this.masterCache) {
      return of(this.masterCache); // return cached
    }

    // Return the in-flight request if already ongoing
    if (this.masterRequest$) {
      return this.masterRequest$;
    }
  
    // No cache or in-flight request: make HTTP call and store the observable
    this.masterRequest$ = this.http.get<Master>(`${this.baseUrl}/master`).pipe(
      tap(master => {
        this.masterCache = master;
      }),
      finalize(() => {
        // Clear the in-flight request when done (success or error)
        this.masterRequest$ = null;
      }),
      shareReplay(1) // Share result with all subscribers and replay the last emitted value
    );
  
    return this.masterRequest$;
  }

  addFavoriteCourt(courtId: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.baseUrl}/favorites`, { courtId })
      .pipe(
        tap(() => {
          //Add to checked favorites localstorage
          const checkedFavoritesLsItem = localStorage.getItem(localStorageNames.checkedFavorites);
          let checkedFavorites: Set<string>;
          if (checkedFavoritesLsItem) {
            checkedFavorites = new Set(JSON.parse(checkedFavoritesLsItem));
          } else {
            checkedFavorites = new Set();
          }
          checkedFavorites.add(courtId);
          localStorage.setItem('checkedFavorites', JSON.stringify(Array.from(checkedFavorites)));

          //Remove from checked master localstorage
          const checkedCourtsLsItem = localStorage.getItem(localStorageNames.checkedCourts);
          let checkedCourts: Set<string>;
          if (checkedCourtsLsItem) {
            checkedCourts = new Set(JSON.parse(checkedCourtsLsItem));
          } else {
            checkedCourts = new Set();
          }
          checkedCourts.delete(courtId);
          localStorage.setItem(localStorageNames.checkedCourts, JSON.stringify(Array.from(checkedCourts)));

          //Notify the sidebar (FavoritesComponent)
          this.favoritesModified.next();
        })
      );
  }

  removeFavoriteCourt(courtId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/favorites/${courtId}`)
      .pipe(
        tap(() => {
          //Remove from checked favorites localstorage
          const checkedFavoritesLsItem = localStorage.getItem(localStorageNames.checkedFavorites);
          let checkedFavorites: Set<string>;
          if (checkedFavoritesLsItem) {
            checkedFavorites = new Set(JSON.parse(checkedFavoritesLsItem));
            checkedFavorites.delete(courtId);
            localStorage.setItem(localStorageNames.checkedFavorites, JSON.stringify(Array.from(checkedFavorites)));
            this.favoritesModified.next();
          }

          //Add to checked master localstorage
          const checkedCourtsLsItem = localStorage.getItem(localStorageNames.checkedCourts);
          let checkedCourts: Set<string>;
          if (checkedCourtsLsItem) {
            checkedCourts = new Set(JSON.parse(checkedCourtsLsItem));
          } else {
            checkedCourts = new Set();
          }
          checkedCourts.add(courtId);
          localStorage.setItem(localStorageNames.checkedCourts, JSON.stringify(Array.from(checkedCourts)));
        })
      );
  }

  addNewCourt(court: Court) {
    return this.http.post<Court>(this.baseUrl, court);
  }

}
