import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MasterCourt } from '@models';

@Injectable({
  providedIn: 'root'
})
export class CourtDisplayService {
  private displayedCourtsSubject = new BehaviorSubject<MasterCourt[]>([]);
  displayedCourts$ = this.displayedCourtsSubject.asObservable();

  constructor() { }

  addDisplayedCourt(court: MasterCourt): void {
    const current = this.displayedCourtsSubject.value;
    const exists = current.some(c => c.id === court.id);
    if (!exists) {
      this.displayedCourtsSubject.next([...current, court]);
    }
  }

  removeDisplayedCourt(court: MasterCourt): void {
    const current = this.displayedCourtsSubject.value;
    const updated = current.filter(c => c.id !== court.id);
    this.displayedCourtsSubject.next(updated);
  }
}
