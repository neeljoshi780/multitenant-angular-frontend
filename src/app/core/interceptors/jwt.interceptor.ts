import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';

/**
 * JwtInterceptor
 *
 * Intercepts outgoing HTTP requests to:
 * 1. Attach JWT token in Authorization header.
 * 2. Handle 401 Unauthorized responses.
 */
@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  /**
   * Injects token service and router
   * for authentication handling.
   */
  constructor(
    private tokenService: TokenService,
    private router: Router
  ) { }

  /**
   * Adds Authorization header if token exists.
   * Handles 401 errors by clearing token
   * and redirecting to login page.
   *
   * @param req Outgoing HTTP request
   * @param next Next handler in interceptor chain
   * @returns Observable of HTTP event stream
   */
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.tokenService.getToken();

    // Attach JWT token if available
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        // Handle unauthorized access
        if (err.status === 401) {
          this.tokenService.removeToken();
          this.router.navigate(['/login']);
        }
        return throwError(() => err);
      })
    );
  }

}