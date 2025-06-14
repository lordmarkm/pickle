import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable, of } from 'rxjs';
import { MasterCourt } from '@models';

@Injectable({
  providedIn: 'root'
})
export class CourtDisplayService {
  private displayedCourtsSubject = new BehaviorSubject<MasterCourt[]>([]);
  displayedCourts$ = this.displayedCourtsSubject.asObservable();
  private refreshEventsSubject = new Subject<string>();
  refreshEvents$ = this.refreshEventsSubject.asObservable();

  constructor() { }

  setDisplayedCourts(courts: MasterCourt[]) {
    this.displayedCourtsSubject.next(courts);
  }

  addDisplayedCourts(courts: MasterCourt[]) {
    const current = this.displayedCourtsSubject.value;
    const newCourts = courts.filter(court => !current.some(c => c.id === court.id));
  
    if (newCourts.length > 0) {
      this.displayedCourtsSubject.next([...current, ...newCourts]);
    }
  }

  addDisplayedCourt(court: MasterCourt) {
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

  triggerRefresh(courtId: string): void {
    this.refreshEventsSubject.next(courtId);
  }
}
