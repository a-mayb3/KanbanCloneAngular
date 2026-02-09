import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIf, NgFor } from '@angular/common';
import { AuthService } from '../../services/auth.service';

import { Project } from '../../models/projects.models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  protected authService = inject(AuthService);

  protected projectList : Project[] = this.authService.currentUser()?.projects || [];

  logout() {
    this.authService.logout().subscribe();
  }
}
