import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  // Public routes
  { 
    path: 'login', 
    component: LoginComponent 
  },

  // Protected routes - require authentication
  { 
    path: '', 
    canActivate: [authGuard],
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  }
];
