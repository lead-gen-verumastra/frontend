import { HttpErrorResponse, HttpEvent, HttpRequest, HttpHandlerFn, HttpInterceptorFn } from '@angular/common/http';
import { LOGIN_SESSION_KEY } from '../constants/constants';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const UserInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const userIsLoggedIn = !!localStorage.getItem(LOGIN_SESSION_KEY);

  if (userIsLoggedIn) {
    const token = localStorage.getItem(LOGIN_SESSION_KEY) as string;

    const modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next(modifiedReq).pipe(
      catchError((error) => {
        if ((error instanceof HttpErrorResponse && error.status === 401) || (error.error.code === 18 || error.error.code === 17)) {
          localStorage.removeItem(LOGIN_SESSION_KEY);
          window.location.reload();
        }

        return throwError(() => error);
      })
    );
  }

  return next(req);
};
