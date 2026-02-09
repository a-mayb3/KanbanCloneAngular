import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../models/projects.models';

@Component({
  selector: 'app-project-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-item.component.html',
  styleUrl: './project-item.component.css'
})
export class ProjectItemComponent {
  @Input({ required: true }) project!: Project;
  @Output() projectClick = new EventEmitter<Project>();

  onProjectClick() {
    this.projectClick.emit(this.project);
  }
}
