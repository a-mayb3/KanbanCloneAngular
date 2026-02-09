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
    withCredentials: true
  });

  // Pass the cloned request to the next handler
  return next(reqWithCredentials).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle different HTTP error codes
      if (error.status === 401) {
        // Unauthorized - redirect to login (but not for session check endpoint)
        // Skip redirect for /me endpoint to avoid issues during app initialization
        if (!req.url.endsWith('/me')) {
          console.error('Unauthorized access - redirecting to login');
          router.navigate(['/login']);
        }
      } else if (error.status === 403) {
        // Forbidden
        console.error('Access forbidden:', error.message);
      } else if (error.status === 0) {
        // Network error
        console.error('Network error - check if the server is running');
      } else {
        // Other errors
        console.error(`HTTP Error ${error.status}:`, error.message);
      }

      // Re-throw the error so components can handle it if needed
      return throwError(() => error);
    })
  );
};
