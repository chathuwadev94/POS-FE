import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiBaseUrlInterceptor } from './core/interceptors/api-base-url.interceptor';
import { responseBodyFormatInterceptor } from './core/interceptors/response-body-format.interceptor';
import { provideState, provideStore } from '@ngrx/store';
import { userReducer } from './core/state/user/user.reducer';
import { provideEffects } from '@ngrx/effects';
import { UserEffect } from './core/state/user/user.efffects';
import { tokenAttachInterceptor } from './core/interceptors/tocken-attach.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,withHashLocation()), 
    provideAnimations(),
     provideHttpClient(withInterceptors([
    apiBaseUrlInterceptor,
    responseBodyFormatInterceptor,
    tokenAttachInterceptor
  ])),
  provideStore(),
  provideState({ name: 'userState', reducer: userReducer }),
  provideEffects(UserEffect)
  ]
};
