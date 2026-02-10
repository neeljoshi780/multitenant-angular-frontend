import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ErrorService } from '../../core/services/error.service';

/**
 * LoginComponent
 *
 * Manages user authentication process.
 * Validates login form and handles
 * success and error responses.
 */
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  /** Toggles password visibility */
  hidePassword = true;

  /** Reactive login form */
  loginForm: FormGroup;

  /** Stores server-side error message */
  serverMessage = '';

  /**
   * Initializes login form with validations
   * and injects required services.
   */
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private errorService: ErrorService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      companyCode: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      username: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]]
    });
  }

  /**
   * Submits login credentials.
   * On success → navigates to dashboard.
   * On error → displays validation or server message.
   */
  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.serverMessage = '';
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.serverMessage = this.errorService.applyFieldErrors(this.loginForm, err) ||
          this.errorService.getMessage(err);
      }
    });
  }

}