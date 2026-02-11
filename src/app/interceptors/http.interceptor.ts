import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

/**
 * HTTP Interceptor that:
 * - Adds withCredentials to all requests (enables cookie sending/receiving)
 * - Handles global HTTP errors
 * - Redirects to login on 401 Unauthorized
 */
export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Clone the request to add withCredentials flag
  // This ensures cookies are sent with every request
  const reqWithCredentials = req.clone({
    withCredentials: true,
  });

  // Pass the cloned request to the next handler
  return next(reqWithCredentials).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        if (router.url !== '/login') {
          router.navigate(['/login']);
        }
      } else if (error.status === 403) {
        console.error('Access forbidden:', error.message);
      } else {
        console.error(`HTTP Error ${error.status}:`, error.message);
      }

      // Re-throw the error so components can handle it if needed
      return throwError(() => error);
    }),
  );
};
