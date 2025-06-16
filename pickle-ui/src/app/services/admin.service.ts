import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private baseUrl = `${environment.functions.baseUrl}/admin`;

  constructor(private http: HttpClient) {}

  addCourtToMaster(courtId: string) {
    console.log(courtId);
    const params = new HttpParams().append('courtId', courtId);
    return this.http.put(`${this.baseUrl}/courts/master`, {}, { params });
  }

}
