import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable, of, Subject } from 'rxjs';
import { map, tap, finalize, shareReplay } from 'rxjs/operators';
import { Master, MasterCourt } from '@models';

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

  getFavorites(): Observable<any> {
    // Return the cached value if available
    if (this.favoritesCache) {
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
    return this.http.put<{ message: string }>(`${this.baseUrl}/favorites`, { courtId})
      .pipe(
        tap(() => {
          const data = localStorage.getItem('checkedFavorites');
          let checkedFavorites: Set<string>;
          if (data) {
            checkedFavorites = new Set(JSON.parse(data));
          } else {
            checkedFavorites = new Set();
          }
          checkedFavorites.add(courtId);
          localStorage.setItem('checkedFavorites', JSON.stringify(Array.from(checkedFavorites)));
          this.favoritesModified.next();
        })
      );
  }

  removeFavoriteCourt(courtId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/favorites/${courtId}`)
      .pipe(
        tap(() => {
          const data = localStorage.getItem('checkedFavorites');
          let checkedFavorites: Set<string>;
          if (data) {
            checkedFavorites = new Set(JSON.parse(data));
            checkedFavorites.delete(courtId);
            localStorage.setItem('checkedFavorites', JSON.stringify(Array.from(checkedFavorites)));
            this.favoritesModified.next();
          }
        })
      );
  }
}
