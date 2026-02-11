import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CreateTaskRequest, Task } from '../../models/tasks.models';

@Component({
  selector: 'app-task-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.css'],
})
export class TaskCreateComponent {
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  title = '';
  description = '';
  status: Task['status'] = 'pending';
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
    if (!this.title.trim()) {
      this.errorMessage.set('Task title is required.');
      return;
    }

    if (this.projectId == null) {
      this.errorMessage.set('Invalid project id.');
      return;
    }

    const payload: CreateTaskRequest = {
      title: this.title.trim(),
      description: this.description.trim() ? this.description.trim() : undefined,
      status: this.status,
    };

    this.isSaving.set(true);
    this.errorMessage.set('');

    this.apiService.post<Task>(`/projects/${this.projectId}/tasks`, payload).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.router.navigate(['/projects', this.projectId]);
      },
      error: (error) => {
        this.isSaving.set(false);
        this.errorMessage.set(error?.error?.message || 'Failed to create task.');
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
