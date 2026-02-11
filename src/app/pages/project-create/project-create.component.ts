import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CreateProjectRequest, Project } from '../../models/projects.models';

@Component({
  selector: 'app-project-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-create.component.html',
  styleUrl: './project-create.component.css',
})
export class ProjectCreateComponent {
  private apiService = inject(ApiService);
  private router = inject(Router);

  name = '';
  description = '';
  isSaving = signal(false);
  errorMessage = signal('');

  onSubmit() {
    if (!this.name.trim()) {
      this.errorMessage.set('Project name is required.');
      return;
    }

    if (!this.description.trim()) {
      this.errorMessage.set('Project description is required.');
      return;
    }

    const payload: CreateProjectRequest = {
      name: this.name.trim(),
      description: this.description.trim(),
    };

    this.isSaving.set(true);
    this.errorMessage.set('');

    this.apiService.post<Project>('/projects', payload).subscribe({
      next: (project) => {
        this.isSaving.set(false);
        if (project?.id != null) {
          this.router.navigate(['/projects/', project.id]);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        this.isSaving.set(false);
        this.errorMessage.set(
          error?.error?.message || 'Failed to create project. Please try again.',
        );
      },
    });
  }

  onCancel() {
    this.router.navigate(['/']);
  }
}
