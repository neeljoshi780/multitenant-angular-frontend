import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

/**
 * AuthGuard
 *
 * Secures protected routes by verifying
 * user authentication status.
 * Redirects unauthenticated users to login page.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  /**
   * Injects token service and router
   * for authentication validation and navigation.
   */
  constructor(
    private tokenService: TokenService,
    private router: Router
  ) { }

  /**
   * Determines whether a route can be activated.
   * Returns true if user is authenticated,
   * otherwise redirects to login and returns false.
   */
  canActivate(): boolean {
    if (this.tokenService.isAuthenticated()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }

}