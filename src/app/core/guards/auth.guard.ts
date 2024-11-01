import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieManageService } from '../services/cookie/cookie-manage.service';
import { environment } from '../../../environments/environment.development';

export const authGuard: CanActivateFn = (route, state) => {
  const cookieManageService = inject(CookieManageService)
  const router = inject(Router);
  try {
    let isLoggedIn: boolean = false;
    isLoggedIn = cookieManageService.getCookie(environment.cookies.authCookieName).isLoggedIn;
    if (isLoggedIn) {
      return true;
    }
    router.navigate(['auth']);
    return false;
  } catch (e) {
    router.navigate(['auth']);
    return false;
  }
};
