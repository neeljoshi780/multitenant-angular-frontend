import { Injectable } from '@angular/core';

/**
 * TokenService
 *
 * Handles JWT token storage and retrieval
 * using browser LocalStorage.
 */
@Injectable({
  providedIn: 'root'
})
export class TokenService {

  /** LocalStorage key for JWT token */
  private readonly TOKEN_KEY = 'jwt_token';

  /**
   * Retrieves stored JWT token.
   *
   * @returns Token string or null if not available
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Stores JWT token in LocalStorage.
   *
   * @param token JWT token string
   */
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
    * Removes JWT token from LocalStorage.
    * Typically used during logout.
    */
  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Checks whether user is authenticated
   * by verifying token presence.
   *
   * @returns True if token exists, otherwise false
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

}