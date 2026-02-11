import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models/auth.models';

@Component({
  selector: 'app-collaborator-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collaborator-item.component.html',
  styleUrl: './collaborator-item.component.css',
})
export class CollaboratorItemComponent {
  @Input({ required: true }) user!: User;
  @Output() remove = new EventEmitter<User>();

  onRemove() {
    this.remove.emit(this.user);
  }
}
