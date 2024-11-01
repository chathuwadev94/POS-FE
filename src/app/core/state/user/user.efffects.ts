import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "../../services/http/auth/auth.service";
import { catchError, exhaustMap, map, of, tap } from "rxjs";
import * as userAction from "./user.action"
import { CookieManageService } from "../../services/cookie/cookie-manage.service";
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment.development";


@Injectable()
export class UserEffect {

    constructor(
        private actions$: Actions,
        private authService: AuthService,
        private readonly cookieManageService: CookieManageService,
        private readonly router: Router
    ) { }

    $login = createEffect(
        () => this.actions$.pipe(
            ofType(userAction.userSignIn),
            exhaustMap(action => this.authService.singIn(action.loginDto).pipe(
                tap(res => {
                    res.isLoggedIn = true;
                    this.cookieManageService.setCookie(environment.cookies.authCookieName, res);
                    this.router.navigateByUrl('terminal');
                }),
                map(user => userAction.setLoggedInUser({ user: user }))
            )),
            catchError(error => of(error))
        )
    )
}