import { User } from "./auth.models";
import { Task } from "./tasks.models";

export interface Project {
  id: number;
  name: string;
  description?: string;
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