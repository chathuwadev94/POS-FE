import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieManageService } from '../services/cookie/cookie-manage.service';
import { environment } from '../../../environments/environment.development';


export const RoleGuard: CanActivateFn = (route, state) => {
  const cookieManageService = inject(CookieManageService)
  const router = inject(Router);

  const userRoles: string[] = cookieManageService.getCookie(environment.cookies.authCookieName).roles;
  const acceptedRoles: string[] = route.data['roles'] || [];
  if (userRoles && userRoles.length > 0) {
    let isExist: string[] = userRoles.filter(r => acceptedRoles.includes(r));
    if (isExist.length > 0) {
      return true;
    }
    router.navigateByUrl(state.url);
  }
  router.navigate(['404']);
  return false;
};

