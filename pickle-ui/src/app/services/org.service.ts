import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Org } from 'app/models/org.model';

@Injectable({
  providedIn: 'root',
})
export class OrgService {
  private baseUrl = `${environment.functions.baseUrl}/owner`;

  constructor(private http: HttpClient) {}

  register(org: Org) {
    return this.http.post<Org>(`${this.baseUrl}/org`, org);
  }
  getOwned() {
    return this.http.get<Org>(`${this.baseUrl}/org`);
  }
}
