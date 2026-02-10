import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TenantService } from '../../services/tenant.service';
import { ErrorService } from '../../core/services/error.service';

/**
 * RegisterComponent
 *
 * Manages multi-step tenant registration process.
 * Step 1 → Company details
 * Step 2 → Admin account setup
 */
@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  /** Current step in registration wizard */
  step = 1;

  /** Toggles admin password visibility */
  hidePassword = true;

  /** Reactive registration form */
  signupForm: FormGroup;

  /** Stores server-side validation or error message */
  serverMessage = '';

  /**
   * Initializes registration form with validations
   * and injects required services.
   */
  constructor(
    private fb: FormBuilder,
    private tenantService: TenantService,
    private errorService: ErrorService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      companyCode: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      companyName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
      companyEmail: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      adminUsername: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      adminEmail: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      adminPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]]
    });
  }

  /**
   * Validates Step 1 (Company details) fields.
   */
  get step1Valid(): boolean {
    return !!(
      this.signupForm.get('companyCode')?.valid &&
      this.signupForm.get('companyName')?.valid &&
      this.signupForm.get('companyEmail')?.valid
    );
  }

  /**
   * Validates Step 2 (Admin account) fields.
   */
  get step2Valid(): boolean {
    return !!(
      this.signupForm.get('adminUsername')?.valid &&
      this.signupForm.get('adminEmail')?.valid &&
      this.signupForm.get('adminPassword')?.valid
    );
  }

  /**
   * Moves registration to next step.
   */
  nextStep(): void {
    this.step = 2;
  }

  /**
   * Returns to previous registration step.
   */
  previousStep(): void {
    this.step = 1;
  }

  /**
   * Submits tenant registration data.
   * On success → redirects to login page.
   * On error → displays validation or server message.
   */
  submitSignup(): void {
    if (this.signupForm.invalid) return;
    this.serverMessage = '';
    const data = this.signupForm.value;
    this.tenantService.register(data).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.serverMessage = this.errorService.applyFieldErrors(this.signupForm, err) ||
          this.errorService.getMessage(err);
      }
    });
  }

}