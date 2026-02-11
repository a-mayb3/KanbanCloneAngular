/**
 * USAGE EXAMPLES - How to use the authentication and API services
 * 
 * Delete this file once you're familiar with the patterns
 */

// ============================================
// 1. LOGIN COMPONENT EXAMPLE
// ============================================

import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { FormsModule } from '@angular/forms';

/*
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="login-form">
      <h2>Login</h2>
      <form (ngSubmit)="onSubmit()">
        <input 
          [(ngModel)]="username" 
          name="username" 
          placeholder="Username" 
          required>
        <input 
          [(ngModel)]="password" 
          name="password" 
          type="password" 
          placeholder="Password" 
          required>
        <button type="submit">Login</button>
      </form>
      @if (errorMessage()) {
        <p class="error">{{ errorMessage() }}</p>
      }
    </div>
  `
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  errorMessage = signal('');

  onSubmit() {
    this.authService.login({ 
      username: this.username, 
      password: this.password 
    }).subscribe({
      next: (response) => {
        if (response.success) {
          // Navigate to dashboard on successful login
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage.set(response.message || 'Login failed');
        }
      },
      error: (err) => {
        this.errorMessage.set('Login error: ' + err.message);
      }
    });
  }
}
*/

// ============================================
// 2. DASHBOARD COMPONENT WITH AUTH STATE
// ============================================

/*
@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="dashboard">
      <h1>Dashboard</h1>
      @if (authService.currentUser()) {
        <p>Welcome, {{ authService.currentUser()?.username }}!</p>
      }
      <button (click)="logout()">Logout</button>
    </div>
  `
})
export class DashboardComponent {
  protected authService = inject(AuthService);

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logged out successfully');
      },
      error: (err) => {
        console.error('Logout error:', err);
      }
    });
  }
}
*/

// ============================================
// 3. MAKING API CALLS WITH ApiService
// ============================================

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './services/api.service';

// Example: Define your data models
interface Task {
  id: number;
  title: string;
  completed: boolean;
}

/*
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiService = inject(ApiService);

  // Get all tasks
  getAllTasks(): Observable<Task[]> {
    return this.apiService.get<Task[]>('/tasks');
  }

  // Get single task
  getTask(id: number): Observable<Task> {
    return this.apiService.get<Task>(`/tasks/${id}`);
  }

  // Create task
  createTask(task: Partial<Task>): Observable<Task> {
    return this.apiService.post<Task>('/tasks', task);
  }

  // Update task
  updateTask(id: number, task: Partial<Task>): Observable<Task> {
    return this.apiService.put<Task>(`/tasks/${id}`, task);
  }

  // Delete task
  deleteTask(id: number): Observable<void> {
    return this.apiService.delete<void>(`/tasks/${id}`);
  }
}
*/

// ============================================
// 4. DIRECT HttpClient USAGE (Alternative)
// ============================================

import { HttpClient } from '@angular/common/http';
import { environment } from './config/environment';

/*
@Injectable({
  providedIn: 'root'
})
export class CustomService {
  private http = inject(HttpClient);

  getData(): Observable<any> {
    // Cookies will be automatically sent due to the interceptor
    return this.http.get(`${environment.apiBaseUrl}/custom-endpoint`);
  }

  postData(data: any): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/custom-endpoint`, data);
  }
}
*/

// ============================================
// 5. APP INITIALIZATION - Check Session on Startup
// ============================================

import { APP_INITIALIZER } from '@angular/core';
import { catchError, of } from 'rxjs';

/*
// Add this to your app.config.ts providers array:
export function initializeApp(authService: AuthService) {
  return () => authService.checkSession().pipe(
    catchError(() => {
      // Session check failed - user is not logged in
      console.log('No active session');
      return of(null);
    })
  );
}

// In app.config.ts providers:
{
  provide: APP_INITIALIZER,
  useFactory: (authService: AuthService) => () => initializeApp(authService),
  deps: [AuthService],
  multi: true
}
*/

// ============================================
// 6. COMPONENT WITH REACTIVE AUTH STATE
// ============================================

/*
@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header>
      @if (authService.isAuthenticated()) {
        <nav>
          <a routerLink="/dashboard">Dashboard</a>
          <a routerLink="/profile">Profile</a>
          <button (click)="logout()">Logout</button>
        </nav>
      } @else {
        <nav>
          <a routerLink="/login">Login</a>
        </nav>
      }
    </header>
  `
})
export class HeaderComponent {
  protected authService = inject(AuthService);

  logout() {
    this.authService.logout().subscribe();
  }
}
*/

// ============================================
// 7. PROTECTED ROUTES CONFIGURATION
// ============================================

/*
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Public routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // Protected routes
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'profile', 
    component: ProfileComponent, 
    canActivate: [authGuard] 
  },
  
  // Lazy-loaded protected module
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent),
    canActivate: [authGuard]
  },
  
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];
*/

export {};
