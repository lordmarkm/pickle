import { Injectable } from '@angular/core';
import { signOut, Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { getIdTokenResult } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  admin: boolean = false;

  constructor(private auth: Auth) {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // Wrap in async IIFE to allow use of await
        (async () => {
          const token = await getIdTokenResult(user, true);
          console.log(token.claims);
          this.admin = token.claims['admin'] === true;
          this.currentUserSubject.next(user);
        })();
      } else {
        this.admin = false;
      }
    });
  }

  isAdmin(): boolean {
    return this.admin;
  }

  setUser(user: User | null) {
    this.currentUserSubject.next(user);
  }

  getUser(): User | null {
    return this.currentUserSubject.value;
  }

  isSignedOut(): boolean {
    return this.getUser() == null;
  }

  logout() {
    return signOut(this.auth)
      .then(() => this.currentUserSubject.next(null))
      .catch(err => console.error('Logout error:', err));
  }
}
