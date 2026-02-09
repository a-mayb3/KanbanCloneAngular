import { ApplicationConfig, provideBrowserGlobalErrorListeners, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { catchError, of } from 'rxjs';

import { routes } from './app.routes';
import { httpInterceptor } from './interceptors/http.interceptor';
import { AuthService } from './services/auth.service';

/**
 * Initialize auth state on app startup by checking for existing session
 */
function initializeAuth(authService: AuthService) {
  return () => authService.checkSession().pipe(
    catchError((error) => {
      // Session check failed - user is not logged in or session expired
      console.log('No active session or session expired');
      authService.clearAuthState();
      return of(null);
    })
  );
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([httpInterceptor])
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [AuthService],
      multi: true
    }
  ]
};
