import { User } from './auth.models';
import { Task } from './tasks.models';

export interface Project {
  id: number;
  name: string;
  description?: string;
  tasks?: Task[];
}

export interface ProjectFull {
  id: number;
  name: string;
  description?: string;
  tasks: Task[];
  users: User[];
}

export interface CreateProjectRequest {
  name: string;
  description: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}

export interface AddCollaboratorRequest {
  user_email: string;
}

export interface AddCollaboratorResponse {
  success?: boolean;
  message?: string;
}
