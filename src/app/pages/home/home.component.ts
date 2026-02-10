import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProjectItemComponent } from '../../components/project-item/project-item.component';
import { Project } from '../../models/projects.models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProjectItemComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  protected authService = inject(AuthService);
  private router = inject(Router);

  protected get projectList(): Project[] {
    return this.authService.currentUser()?.projects ?? [];
  }

  onCreateProject() {
    this.router.navigate(['/projects/new']);
  }
}
