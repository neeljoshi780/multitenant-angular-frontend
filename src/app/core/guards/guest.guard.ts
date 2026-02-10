import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

/**
 * GuestGuard
 *
 * Prevents authenticated users from accessing public routes
 * like Login and Register.
 * Redirects authenticated users to the dashboard.
 */
@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) { }

  /**
   * Determines whether a route can be activated.
   * Returns true if user is NOT authenticated (is a guest),
   * otherwise redirects to dashboard and returns false.
   */
  canActivate(): boolean {
    if (this.tokenService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
      return false;
    }
    return true;
  }
}
