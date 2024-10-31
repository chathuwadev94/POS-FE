import { Component, Inject, OnInit, inject, signal } from '@angular/core';
import { PrimengModule } from '../../core/modules/primeng/primeng.module';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/http/auth/auth.service';
import { ILoginDto } from '../../core/interfaces/auth/auth.dto';
import { Observable, catchError, of, take, tap } from 'rxjs';
import { ILoginResponse } from '../../core/interfaces/auth/auth.responseinerface';
import { CookieManageService } from '../../core/services/cookie/cookie-manage.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { StateService } from '../../core/store/state.service';
import { Store } from '@ngrx/store';
import * as userAction from '../../core/state/user/user.action';
import * as userSelector from '../../core/state/user/user.selector'
import { IUser } from '../../core/interfaces/user/user.interface';
import { AsyncPipe } from '@angular/common';
import { UserStore } from '../../core/signal-store/user.store';
import { ToastMessageService } from '../../core/services/toast-message/toast-message.service';
import { SpinnerService } from '../../core/services/toast-message/spinner.service';

const authCookieName = 'AUTH_USER';
@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe
  ],
  providers: [],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent implements OnInit {

  signInForm: FormGroup = new FormGroup({});
  shopName:string = 'K Super Mart';
  loggedInUser = signal<ILoginResponse | undefined>(undefined)
  user$!: Observable<IUser | undefined>;

  userStore = inject(UserStore);

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly spinnerService: SpinnerService,
    @Inject(CookieManageService)
    private cookieManageService: CookieManageService,
    private router: Router,
    @Inject(StateService)
    private readonly stateService: StateService,
    private store: Store,
    private toastMessageService: ToastMessageService
  ) {
    this.user$ = this.store.select(userSelector.selectLoggedInUser);
  }

  ngOnInit(): void {
    this.initForm();

  }

  initForm(): void {
    this.signInForm = this.fb.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })
  }

  get signInFormControl() {
    return this.signInForm.controls;
  }

  get f(): any {
    return this.signInForm.controls;
  }

  onSignIn(): void {
    if (this.signInForm.valid) {
      this.spinnerService.showSpinner(true);
      let loginDto: ILoginDto = {
        userName: this.signInForm.value.username,
        password: this.signInForm.value.password
      }


      // USING SIGNAL STAE ANG NGRX SIGNAL
      // this.stateService.loginUser(loginDto).subscribe(res => {
      //   this.userStore.setUser(res)
      // });

      // USING NGRX STORE
      // this.store.dispatch(userAction.userSignIn({ loginDto }));


      // ----------------------------------------------------------------
      // USING USUALL ASYNC CALL AND NGRX SIGNAL
      this.authService.singIn(loginDto)
        .pipe(
          take(1),
          tap((response: any) => {
            let accessTokenResponse: ILoginResponse = response;
            this.userStore.setUser(response)
            accessTokenResponse.isLoggedIn = true;
            this.cookieManageService.setCookie(authCookieName, accessTokenResponse);
            this.loggedInUser.set(accessTokenResponse);
            this.toastMessageService.addNotification('success', 'Logged in successfully');
            this.router.navigateByUrl('terminal');
            this.spinnerService.showSpinner(false);
          }),
          catchError((err: HttpErrorResponse) => {
            this.spinnerService.showSpinner(false);
            const message = err?.error?.message || 'Failed to Login!';
            this.toastMessageService.addNotification('error', message);
            this.signInForm.reset();
            this.router.navigateByUrl('auth');
            return of();
          })
        ).subscribe();

    } else {
      this.signInForm.markAllAsTouched();
    }
  }

}
