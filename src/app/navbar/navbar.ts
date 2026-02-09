import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected authService = inject(AuthService);

  
}
