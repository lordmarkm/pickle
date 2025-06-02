import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourtService {
  private baseUrl = `${environment.functions.baseUrl}/courts`;

  constructor(private http: HttpClient) {}

  getFavorites(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/favorites`);
  }

  addFavoriteCourt(courtId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/courts/favorites`, {
      courtId,
    });
  }

  removeFavoriteCourt(courtId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/courts/favorites/${courtId}`);
  }
}
