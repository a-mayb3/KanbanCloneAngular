import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  APP_INITIALIZER,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { catchError, of, throwError } from 'rxjs';

import { routes } from './app.routes';
import { httpInterceptor } from './interceptors/http.interceptor';
import { AuthService } from './services/auth.service';

/**
 * Initialize auth state on app startup by checking for existing session
 */
function initializeAuth(authService: AuthService) {
  return () =>
    authService.checkSession().pipe(
      catchError((error) => {
        console.error('Session check failed:', error);
        if (error?.status === 401 || error?.status === 422) {
          authService.clearAuthState();
          return of(null);
        }
        authService.clearAuthState();
        return throwError(() => error);
      }),
    );
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([httpInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [AuthService],
      multi: true,
    },
  ],
};
