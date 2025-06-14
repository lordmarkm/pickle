import { Injectable } from '@angular/core';
import { signOut, Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private auth: Auth) {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  setUser(user: User | null) {
    this.currentUserSubject.next(user);
  }

  getUser(): User | null {
    return this.currentUserSubject.value;
  }

  isSignedOut(): boolean {
    const user = this.getUser();
    return null == user;
  }

  logout() {
    return signOut(this.auth)
      .then(() => this.currentUserSubject.next(null))
      .catch(err => console.error('Logout error:', err));
  }
}
