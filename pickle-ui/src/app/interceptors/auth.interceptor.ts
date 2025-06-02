import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent
} from '@angular/common/http';
import { from, of, switchMap } from 'rxjs';
import { Auth, getIdToken } from '@angular/fire/auth';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const auth = inject(Auth);
  const user = auth.currentUser;

  if (!user) {
    return next(req); // no user, pass request unmodified
  }

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
};
