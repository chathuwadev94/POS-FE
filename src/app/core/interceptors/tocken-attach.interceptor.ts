import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieManageService } from '../services/cookie/cookie-manage.service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastMessageService } from '../services/toast-message/toast-message.service';
const authCookieName = 'AUTH_USER';


export const tokenAttachInterceptor: HttpInterceptorFn = (req, next) => {
  const cookie = inject(CookieManageService);
  const user = cookie.getCookie(authCookieName);
  const router = inject(Router)
  const messageServ = inject(ToastMessageService)
  if (user) {
    const tokenizedRequest = req.clone({
      headers: req.headers.append('Authorization', 'Bearer ' + user.accessToken),
    });
    return handler(tokenizedRequest, router, messageServ)
  }
  return handler(req, router, messageServ)

  function handler(req: HttpRequest<unknown>, router: Router, toastMessageService: ToastMessageService) {
    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error instanceof HttpErrorResponse) {
          if (
            error.status === 401 &&
            error.error &&
            error.error.message === 'Unauthorized'
          ) {
            toastMessageService.addNotification('warn', 'Your session timed out');
            router.navigate(['auth']);
          }
        }
        return throwError(() => error);
      })
    )
  }
};
