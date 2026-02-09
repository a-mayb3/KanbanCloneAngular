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
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'projects/new',
        loadComponent: () => import('./pages/project-create/project-create.component').then(m => m.ProjectCreateComponent)
      },
      {
        path: 'projects/:id',
        loadComponent: () => import('./pages/project-details/project-details.component').then(m => m.ProjectDetailsComponent)
      }
    ]
  }
];
