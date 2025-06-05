import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Master, MasterCourt } from '@models';

@Injectable({
  providedIn: 'root',
})
export class CourtService {
  private baseUrl = `${environment.functions.baseUrl}/courts`;
  private favoritesCache: any | null = null;
  private masterCache: Master | null = null;

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
    if (this.favoritesCache) {
      return of(this.favoritesCache); // return cached
    }

    return this.http.get<any>(`${this.baseUrl}/favorites`).pipe(
      tap(favorites => this.favoritesCache = favorites)
    );
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
    return this.http.get<Master>(`${this.baseUrl}/master`).pipe(
      tap(master => this.masterCache = master)
    );
  }

  addFavoriteCourt(courtId: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.baseUrl}/favorites`, {
      courtId
    });
  }

  removeFavoriteCourt(courtId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/favorites/${courtId}`);
  }
}
