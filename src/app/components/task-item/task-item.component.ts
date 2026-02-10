import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/tasks.models';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css',
})
export class TaskItemComponent {
  private _task!: Task;
  statusValue: Task['status'] = 'pending';

  @Input({ required: true })
  set task(value: Task) {
    this._task = value;
    this.statusValue = value?.status ?? 'pending';
  }

  get task(): Task {
    return this._task;
  }

  @Output() statusChange = new EventEmitter<{
    task: Task;
    status: Task['status'];
    previousStatus: Task['status'];
  }>();

  @Output() remove = new EventEmitter<Task>();

  readonly statusOptions: Task['status'][] = [
    'pending',
    'in_progress',
    'completed',
    'stashed',
    'failed',
  ];

  onStatusChange(value: Task['status']) {
    const previousStatus = this.statusValue;
    const nextStatus = value;
    this.statusValue = nextStatus;
    if (this._task) {
      this._task.status = nextStatus;
      this.statusChange.emit({
        task: this._task,
        status: nextStatus,
        previousStatus,
      });
    }
  }

  onRemove() {
    if (this._task) {
      this.remove.emit(this._task);
    }
  }
}
