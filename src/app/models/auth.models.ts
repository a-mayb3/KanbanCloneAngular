/**
 * Authentication-related type definitions
 */

import { Project } from "./projects.models";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  user?: User;
  token?: string; // Optional: if you need the JWT on client side
}

export interface User {
  id: string | number;
  name: string;
  email: string;
  projects?: Project[]; // Add project type if available
  // Add other user properties as needed
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}
