import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Project } from '../../models/projects.models';

@Component({
  selector: 'app-project-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './project-item.component.html',
  styleUrl: './project-item.component.css'
})
export class ProjectItemComponent {
  @Input({ required: true }) project!: Project;

  get projectRoute(): Array<string | number> | null {
    const id = this.getProjectId();
    return id == null ? null : ['/projects', id];
  }

  get projectState(): { project: Project } | null {
    return this.projectRoute ? { project: this.project } : null;
  }

  private getProjectId(): string | number | null {
    const projectAsAny = this.project as Project & {
      _id?: string | number;
      projectId?: string | number;
    };

    return projectAsAny.id ?? projectAsAny.projectId ?? projectAsAny._id ?? null;
  }
}
