import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ProjectFull } from '../../models/projects.models';
import { CollaboratorItemComponent } from '../../components/collaborator-item/collaborator-item.component';
import { TaskItemComponent } from '../../components/task-item/task-item.component';
import { User } from '../../models/auth.models';

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
}
