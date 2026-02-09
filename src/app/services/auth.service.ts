import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse, User, AuthState } from '../models/auth.models';
import { environment } from '../config/environment';

/**
 * Authentication service that manages user login, logout, and session state
 * Uses signals for reactive state management
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Reactive auth state using signals
  private authState = signal<AuthState>({
    isAuthenticated: false,
    user: null
  });

  // Public computed signals for components to consume
  readonly isAuthenticated = computed(() => this.authState().isAuthenticated);
  readonly currentUser = computed(() => this.authState().user);

  /**
   * Login with credentials
   * The JWT will be set as an HTTP-only cookie by the backend
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${environment.apiBaseUrl}/auth/login`,
      credentials
    ).pipe(
      tap(response => {
        if (response.success || response.user) {
          // Update auth state even if the backend only sets a cookie
          this.authState.set({
            isAuthenticated: true,
            user: response.user ?? null
          });
        }
      })
    );
  }

  /**
   * Logout the current user
   * Clears the session cookie on the backend
   */
  logout(): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/me/logout`).pipe(
      tap(() => {
        // Clear auth state
        this.authState.set({
          isAuthenticated: false,
          user: null
        });
        // Redirect to login
        this.router.navigate(['/login']);
      }),
      catchError((error) => {
        // Even if logout fails on backend, clear local state
        this.clearAuthState();
        return throwError(() => error);
      })
    );
  }

  /**
   * Check current session / get current user
   * Call this on app initialization to restore session state
   */
  checkSession(): Observable<User> {
    return this.http.get<User>(`${environment.apiBaseUrl}/me`).pipe(
      tap(user => {
        this.authState.set({
          isAuthenticated: true,
          user: user
        });
      })
    );
  }

  /**
   * Clear auth state (use when session expires or on error)
   */
  clearAuthState(): void {
    this.authState.set({
      isAuthenticated: false,
      user: null
    });
    this.router.navigate(['/login']);
  }
}
