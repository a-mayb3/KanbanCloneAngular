export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'stashed' | 'failed';
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status: Task['status'];
}
