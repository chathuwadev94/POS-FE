import { Inject, Injectable, computed, inject, signal } from '@angular/core';
import { IUser } from '../interfaces/user/user.interface';
import { ILoginDto } from '../interfaces/auth/auth.dto';
import { Observable, catchError, of, take, tap } from 'rxjs';
import { AuthService } from '../services/http/auth/auth.service';
import { ILoginResponse } from '../interfaces/auth/auth.responseinerface';
import { CookieManageService } from '../services/cookie/cookie-manage.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Route, Router } from '@angular/router';

const authCookieName = 'AUTH_USER';
export interface IState {
  user: IUser;
  isAuthenticated: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class StateService {

  // State
  private state = signal<IState>({
    user: {},
    isAuthenticated: false
  });

  // Selectors
  isAuthenticateUser = computed(() => this.state().isAuthenticated);
  loggedInUser = computed(() => this.state().user);

  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
    @Inject(CookieManageService)
    private readonly cookieManageService: CookieManageService,
    private readonly router:Router
  ) { }

  setUser(user: IUser): void {
    this.state.update(state => ({ ...state, user: user }));
  }

  setIsAuthenticate(isAuthenticate: boolean): void {
    this.state.update(state => ({ ...state, isAuthenticated: isAuthenticate }));
  }

  // Actions
  loginUser(loginDto: ILoginDto): Observable<IUser> {
    return this.authService.singIn(loginDto).pipe(
      take(1),
      tap((response: ILoginResponse) => {
        response.isLoggedIn=true;
        this.cookieManageService.setCookie(authCookieName, response);
        // should set loggedin user
        this.setUser(response);
        this.setIsAuthenticate(true);
        this.router.navigateByUrl('terminal');
        
      }),
      catchError((err: HttpErrorResponse) => {
        return of();
      })
    )
  }
}
