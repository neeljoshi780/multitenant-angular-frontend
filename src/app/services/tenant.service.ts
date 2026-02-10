import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../core/config/api.config';
import { RegisterRequest } from '../models/auth.model';

/**
 * TenantService
 *
 * Handles tenant-related API operations.
 * Currently manages tenant registration.
 */
@Injectable({
  providedIn: 'root'
})
export class TenantService {

  /** Base tenant administration API URL */
  private readonly apiUrl = `${API_CONFIG.baseUrl}${API_CONFIG.tenantAdmin}`;

  /**
   * Injects HttpClient for backend communication.
   */
  constructor(private http: HttpClient) { }

  /**
   * Registers a new tenant company along with
   * initial admin account details.
   *
   * @param data Registration payload
   * @returns Observable containing API response
   */
  register(data: RegisterRequest): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

}