import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ProjectFull } from '../../models/projects.models';
import { CollaboratorItemComponent } from '../../components/collaborator-item/collaborator-item.component';
import { TaskItemComponent } from '../../components/task-item/task-item.component';
import { User } from '../../models/auth.models';
import { Task } from '../../models/tasks.models';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, CollaboratorItemComponent, TaskItemComponent],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.css',
})
export class ProjectDetailsComponent {
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projectId: number | null = null;

  project = signal<ProjectFull | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');

  get taskCompletionPercentage(): number {
    const tasks = this.project()?.tasks ?? [];
    if (tasks.length === 0) {
      return 0;
    }

    const completedCount = tasks.filter((task) => task.status === 'completed').length;
    return Math.round((completedCount / tasks.length) * 100);
  }

  constructor() {
    const navState = this.router.getCurrentNavigation()?.extras.state ?? (history.state as any);
    const initialProject = navState?.project as ProjectFull | undefined;

    if (initialProject) {
      this.project.set(initialProject);
      this.isLoading.set(false);
    }

    const idParam = this.route.snapshot.paramMap.get('id');
    const projectId = idParam ? Number(idParam) : Number.NaN;

    if (!Number.isFinite(projectId)) {
      this.isLoading.set(false);
      this.errorMessage.set('Invalid project id.');
      return;
    }

    this.projectId = projectId;

    this.apiService.get<ProjectFull>(`/projects/${projectId}`).subscribe({
      next: (project) => {
        this.project.set(project);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        if (!initialProject) {
          this.errorMessage.set(error?.error?.message || 'Failed to load project details.');
        }
      },
    });
  }

  onBack() {
    this.router.navigate(['/']);
  }

  onRemoveCollaborator(user: User) {
    const current = this.project();
    if (!current || this.projectId == null) {
      return;
    }

    const targetId = this.getUserId(user);
    if (!targetId) {
      return;
    }

    const previousUsers = current.users ?? [];
    const updatedUsers = (current.users ?? []).filter(
      (collaborator) => this.getUserId(collaborator) !== targetId,
    );

    this.project.set({
      ...current,
      users: updatedUsers,
    });

    this.apiService.delete<void>(`/projects/${this.projectId}/users/${targetId}`).subscribe({
      error: (error) => {
        this.project.set({
          ...current,
          users: previousUsers,
        });
        this.errorMessage.set(error?.error?.message || 'Failed to remove collaborator.');
      },
    });
  }

  private getUserId(user: User): string {
    return String(user.id ?? '');
  }

  onAddTask() {
    if (this.projectId == null) {
      return;
    }

    this.router.navigate(['/projects', this.projectId, 'tasks', 'new']);
  }

  onTaskStatusChange(event: {
    task: Task;
    status: Task['status'];
    previousStatus: Task['status'];
  }) {
    if (this.projectId == null) {
      return;
    }

    this.apiService
      .put<void>(`/projects/${this.projectId}/tasks/${event.task.id}`, {
        status: event.status,
      })
      .subscribe({
        error: (error) => {
          const current = this.project();
          if (!current) {
            return;
          }

          const updatedTasks = (current.tasks ?? []).map((task) =>
            task.id === event.task.id
              ? {
                  ...task,
                  status: event.previousStatus,
                }
              : task,
          );

          this.project.set({
            ...current,
            tasks: updatedTasks,
          });

          this.errorMessage.set(error?.error?.message || 'Failed to update task status.');
        },
      });
  }

  onAddCollaborator() {
    if (this.projectId == null) {
      return;
    }

    this.router.navigate(['/projects', this.projectId, 'collaborators', 'new']);
  }

  onDeleteProject() {
    if (this.projectId == null) {
      return;
    }

    this.apiService.delete<void>(`/projects/${this.projectId}`).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.errorMessage.set(error?.error?.message || 'Failed to delete project.');
      },
    });
  }

  onEditProject() {
    if (this.projectId == null) {
      return;
    }

    this.router.navigate(['/projects', this.projectId, 'edit']);
  }

  trackByTaskId(_index: number, task: Task): number {
    return task.id;
  }

  trackByUserId(_index: number, user: User): string | number {
    return user.id;
  }
}
