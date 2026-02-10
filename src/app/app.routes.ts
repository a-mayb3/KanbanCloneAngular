import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  // Public routes
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then((m) => m.RegisterComponent),
  },

  // Protected routes - require authentication
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'projects/new',
        loadComponent: () =>
          import('./pages/project-create/project-create.component').then(
            (m) => m.ProjectCreateComponent,
          ),
      },
      {
        path: 'projects/:id',
        loadComponent: () =>
          import('./pages/project-details/project-details.component').then(
            (m) => m.ProjectDetailsComponent,
          ),
      },
      {
        path: 'projects/:id/edit',
        loadComponent: () =>
          import('./pages/project-edit/project-edit.component').then((m) => m.ProjectEditComponent),
      },
      {
        path: 'projects/:id/collaborators/new',
        loadComponent: () =>
          import('./pages/collaborator-add/collaborator-add.component').then(
            (m) => m.CollaboratorAddComponent,
          ),
      },
      {
        path: 'projects/:id/tasks/new',
        loadComponent: () =>
          import('./pages/task-create/task-create.component').then((m) => m.TaskCreateComponent),
      },
    ],
  },
];
