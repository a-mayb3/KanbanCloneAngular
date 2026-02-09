import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../config/environment';

/**
 * Base API service that provides common HTTP operations
 * Other services can inject this for reusable API patterns
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  protected readonly baseUrl = environment.apiBaseUrl;

  /**
   * HTTP GET request
   */
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`);
  }

  /**
   * HTTP POST request
   */
  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body);
  }

  /**
   * HTTP PUT request
   */
  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body);
  }

  /**
   * HTTP DELETE request
   */
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
  }
}
