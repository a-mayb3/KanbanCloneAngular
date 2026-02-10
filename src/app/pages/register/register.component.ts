import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { RegisterRequest, RegisterResponse } from '../../models/auth.models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private apiService = inject(ApiService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';
  isLoading = signal(false);
  errorMessage = signal('');

  onSubmit() {
    if (!this.name || !this.email || !this.password) {
      this.errorMessage.set('Please fill in all fields');
      return;
    }

    const payload: RegisterRequest = {
      name: this.name.trim(),
      email: this.email.trim(),
      password: this.password,
    };

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.apiService.post<RegisterResponse>('/users/', payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error?.error?.message || 'Registration failed.');
      },
    });
  }
}
