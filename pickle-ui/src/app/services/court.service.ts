import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Court, Master } from '@models';

@Injectable({
  providedIn: 'root',
})
export class CourtService {
  private baseUrl = `${environment.functions.baseUrl}/courts`;
  private favoritesCache: string[] | null = null;
  private masterCache: any | null = null;

  constructor(private http: HttpClient) {}

  getFavorites(): Observable<string[]> {
    if (this.favoritesCache) {
      return of(this.favoritesCache); // return cached
    }

    return this.http.get<string[]>(`${this.baseUrl}/favorites`).pipe(
      tap(favorites => this.favoritesCache = favorites)
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
    return this.http.post<{ message: string }>(`${this.baseUrl}/favorites`, {
      courtId,
    });
  }

  removeFavoriteCourt(courtId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/favorites/${courtId}`);
  }
}
