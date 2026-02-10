import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../core/config/api.config';
import { User } from '../models/user.model';
import { PageResponse } from '../models/page-response.model';

/**
 * UserService
 *
 * Handles user-related API operations
 * including CRUD and paginated retrieval.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {

  /** Base user API URL */
  private readonly apiUrl = `${API_CONFIG.baseUrl}${API_CONFIG.user}`;

  /**
   * Injects HttpClient for API communication.
   */
  constructor(private http: HttpClient) { }

  /**
   * Retrieves paginated list of users
   * with sorting support.
   *
   * @param pageNo Page number (default: 0)
   * @param pageSize Records per page (default: 10)
   * @param sortBy Field name for sorting
   * @param sortDir Sort direction ('asc' | 'desc')
   * @returns Observable containing PageResponse<User>
   */
  getUsers(
    pageNo = 0,
    pageSize = 10,
    sortBy = 'id',
    sortDir = 'asc'
  ): Observable<PageResponse<User>> {
    const params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);
    return this.http.get<PageResponse<User>>(this.apiUrl, { params });
  }

  /**
   * Retrieves user details by ID.
   *
   * @param id User identifier
   * @returns Observable containing User data
   */
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  /**
   * Creates a new user record.
   *
   * @param user User payload
   * @returns Observable containing created User
   */
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  /**
   * Updates an existing user record.
   *
   * @param user Updated user payload
   * @returns Observable containing updated User
   */
  updateUser(user: User): Observable<User> {
    return this.http.put<User>(this.apiUrl, user);
  }

  /**
   * Deletes a user by ID.
   *
   * @param id User identifier
   * @returns Observable<void>
   */
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}