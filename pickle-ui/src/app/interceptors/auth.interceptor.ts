import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn
} from '@angular/common/http';
import { from, switchMap } from 'rxjs';
import { Auth, getIdToken } from '@angular/fire/auth';
import { ReCaptchaV3Service } from 'ng-recaptcha-2';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const auth = inject(Auth);
  const recaptchaV3Service = inject(ReCaptchaV3Service);
  const user = auth.currentUser;

  if (user) {
    return from(getIdToken(user)).pipe(
      switchMap(token => {
        const cloned = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next(cloned);
      })
    );
  }

  // No user: fallback to reCAPTCHA v3
  return recaptchaV3Service.execute('submit').pipe(
    switchMap((recaptchaToken: string) => {
      const cloned = req.clone({
        setHeaders: {
          'X-Recaptcha-Token': recaptchaToken
        }
      });
      return next(cloned);
    })
  );
};
