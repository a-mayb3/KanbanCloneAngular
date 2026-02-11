import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Project, UpdateProjectRequest } from '../../models/projects.models';

@Component({
  selector: 'app-project-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-edit.component.html',
  styleUrl: './project-edit.component.css',
})
export class ProjectEditComponent {
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  name = '';
  description = '';
  isSaving = signal(false);
  isLoading = signal(true);
  errorMessage = signal('');
  private projectId: number | null = null;

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const projectId = idParam ? Number(idParam) : Number.NaN;

    if (!Number.isFinite(projectId)) {
      this.isLoading.set(false);
      this.errorMessage.set('Invalid project id.');
      return;
    }

    this.projectId = projectId;

    this.apiService.get<Project>(`/projects/${projectId}`).subscribe({
      next: (project) => {
        this.name = project.name ?? '';
        this.description = project.description ?? '';
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error?.error?.message || 'Failed to load project.');
      },
    });
  }

  onSubmit() {
    if (!this.name.trim()) {
      this.errorMessage.set('Project name is required.');
      return;
    }

    if (!this.description.trim()) {
      this.errorMessage.set('Project description is required.');
      return;
    }

    if (this.projectId == null) {
      this.errorMessage.set('Invalid project id.');
      return;
    }

    const payload: UpdateProjectRequest = {
      name: this.name.trim(),
      description: this.description.trim(),
    };

    this.isSaving.set(true);
    this.errorMessage.set('');

    this.apiService.put<Project>(`/projects/${this.projectId}`, payload).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.router.navigate(['/projects', this.projectId]);
      },
      error: (error) => {
        this.isSaving.set(false);
        this.errorMessage.set(error?.error?.message || 'Failed to update project.');
      },
    });
  }

  onCancel() {
    if (this.projectId != null) {
      this.router.navigate(['/projects', this.projectId]);
    } else {
      this.router.navigate(['/']);
    }
  }
}
