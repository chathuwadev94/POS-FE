import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CookieManageService {
  constructor(private cookieService: CookieService) { }

  public setCookie(cookieName: string, value: any) {
      if (this.cookieService.check(cookieName)) {
          this.cookieService.delete(cookieName);
      }
      this.cookieService.set(cookieName, JSON.stringify(value), {
          expires: 7,
          path: '/',
          sameSite: 'None',
          secure: true,
      });
  }

  public getCookie(cookieName: string): any {
      if (this.cookieService.check(cookieName)) {
          return JSON.parse(this.cookieService.get(cookieName));
      }
      return null;
  }

  public deleteCookie(cookieName: string): void {
      this.cookieService.delete(cookieName, '/');
      this.cookieService.deleteAll('/');
  }
}