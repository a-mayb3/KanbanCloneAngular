import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { catchError, of, throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
      return;
    }

    this.authService
      .checkSession()
      .pipe(
        catchError((error) => {
          if (error?.status === 401 || error?.status === 422) {
            return of(null);
          }
          return throwError(() => error);
        }),
      )
      .subscribe({
        next: (user) => {
          if (user) {
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          this.errorMessage.set(error?.error?.message || 'Session check failed.');
        },
      });
  }

  email = '';
  password = '';
  isLoading = signal(false);
  errorMessage = signal('');

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage.set('Please fill in all fields');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService
      .login({
        email: this.email,
        password: this.password,
      })
      .subscribe({
        next: (response) => {
          this.isLoading.set(false);
          if (response.success || response.user) {
            // Redirect to home/dashboard after successful login
            this.router.navigate(['/']);
          } else {
            this.errorMessage.set(response.message || 'Login failed');
          }
        },
        error: (error) => {
          this.isLoading.set(false);
          this.errorMessage.set(
            error.error?.message || 'Login failed. Please check your credentials.',
          );
        },
      });
  }
}
