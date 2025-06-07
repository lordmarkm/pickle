import { Component, OnInit, OnDestroy } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from '@angular/fire/auth';
import { AuthService } from '@services';
import { User } from '@angular/fire/auth';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  user: User | null = null;
  constructor(private auth: Auth, private authService: AuthService) {}
  ngOnInit() {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(u => {
        this.user = u;
      });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then(result => {
        console.log('Logged in with Google:', result.user);
        this.authService.setUser(result.user);
      })
      .catch(err => console.error('Google login error:', err));
  }
  loginWithFacebook() {
    const provider = new FacebookAuthProvider();
    signInWithPopup(this.auth, provider)
      .then(result => {
        console.log('Logged in with Facebook:', result.user)
        this.authService.setUser(result.user); 
      })
      .catch(err => console.error('Facebook login error:', err));
  }
  logout() {
    this.authService.logout();
  }
}
