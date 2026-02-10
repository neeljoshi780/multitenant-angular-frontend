import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { LoginRequest, LoginResponse } from '../../models/auth.model';
import { TokenService } from './token.service';

/**
 * AuthService
 *
 * Handles authentication operations including
 * login and logout. Communicates with backend
 * authentication APIs and manages JWT token storage.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /** Base authentication API URL */
  private readonly apiUrl = `${API_CONFIG.baseUrl}${API_CONFIG.auth}`;

  /**
   * Injects HTTP client, token service,
   * and router for authentication flow.
   */
  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) { }

  /**
   * Authenticates user using provided credentials.
   * Stores JWT token upon successful login.
   *
   * @param credentials Login request payload
   * @returns Observable containing LoginResponse
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response?.token) {
          this.tokenService.setToken(response.token);
        }
      })
    );
  }

  /**
   * Logs out the authenticated user.
   * Clears stored JWT token and redirects to login page.
   */
  logout(): void {
    this.tokenService.removeToken();
    this.router.navigate(['/login']);
  }

}