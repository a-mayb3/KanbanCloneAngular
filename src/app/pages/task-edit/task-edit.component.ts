import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Task, UpdateTaskRequest } from '../../models/tasks.models';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css'],
})
export class TaskEditComponent {
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  title = '';
  description = '';
  status: Task['status'] = 'pending';
  isLoading = signal(true);
  isSaving = signal(false);
  errorMessage = signal('');
  private projectId: number | null = null;
  private taskId: number | null = null;

  constructor() {
    const navState = this.router.getCurrentNavigation()?.extras.state ?? (history.state as any);
    const initialTask = navState?.task as Task | undefined;

    const projectParam = this.route.snapshot.paramMap.get('id');
    const taskParam = this.route.snapshot.paramMap.get('taskId');
    const projectId = projectParam ? Number(projectParam) : Number.NaN;
    const taskId = taskParam ? Number(taskParam) : Number.NaN;

    if (!Number.isFinite(projectId) || !Number.isFinite(taskId)) {
      this.isLoading.set(false);
      this.errorMessage.set('Invalid project or task id.');
      return;
    }

    this.projectId = projectId;
    this.taskId = taskId;

    if (initialTask && initialTask.id === taskId) {
      this.title = initialTask.title ?? '';
      this.description = initialTask.description ?? '';
      this.status = initialTask.status ?? 'pending';
      this.isLoading.set(false);
      return;
    }

    this.apiService.get<Task>(`/projects/${projectId}/tasks/${taskId}`).subscribe({
      next: (task) => {
        this.title = task.title ?? '';
        this.description = task.description ?? '';
        this.status = task.status ?? 'pending';
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error?.error?.message || 'Failed to load task.');
      },
    });
  }

  onSubmit() {
    if (!this.title.trim()) {
      this.errorMessage.set('Task title is required.');
      return;
    }

    if (this.projectId == null || this.taskId == null) {
      this.errorMessage.set('Invalid project or task id.');
      return;
    }

    const payload: UpdateTaskRequest = {
      title: this.title.trim(),
      description: this.description.trim() ? this.description.trim() : undefined,
      status: this.status,
    };

    this.isSaving.set(true);
    this.errorMessage.set('');

    this.apiService
      .put<Task>(`/projects/${this.projectId}/tasks/${this.taskId}`, payload)
      .subscribe({
        next: () => {
          this.isSaving.set(false);
          this.router.navigate(['/projects', this.projectId]);
        },
        error: (error) => {
          this.isSaving.set(false);
          this.errorMessage.set(error?.error?.message || 'Failed to update task.');
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
