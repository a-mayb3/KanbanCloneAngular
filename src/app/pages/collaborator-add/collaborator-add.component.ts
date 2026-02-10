import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AddCollaboratorRequest, AddCollaboratorResponse } from '../../models/projects.models';

@Component({
  selector: 'app-collaborator-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './collaborator-add.component.html',
  styleUrl: './collaborator-add.component.css',
})
export class CollaboratorAddComponent {
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  email = '';
  isSaving = signal(false);
  errorMessage = signal('');
  private projectId: number | null = null;

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const projectId = idParam ? Number(idParam) : Number.NaN;

    if (!Number.isFinite(projectId)) {
      this.errorMessage.set('Invalid project id.');
      return;
    }

    this.projectId = projectId;
  }

  onSubmit() {
    if (!this.email.trim()) {
      this.errorMessage.set('Collaborator email is required.');
      return;
    }

    if (this.projectId == null) {
      this.errorMessage.set('Invalid project id.');
      return;
    }

    const payload: AddCollaboratorRequest = {
      user_email: this.email.trim(),
    };

    this.isSaving.set(true);
    this.errorMessage.set('');

    this.apiService
      .post<AddCollaboratorResponse>(`/projects/${this.projectId}/users/`, payload)
      .subscribe({
        next: () => {
          this.isSaving.set(false);
          this.router.navigate(['/projects', this.projectId]);
        },
        error: (error) => {
          this.isSaving.set(false);
          this.errorMessage.set(error?.error?.message || 'Failed to add collaborator.');
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
