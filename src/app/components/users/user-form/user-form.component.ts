import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ErrorService } from '../../../core/services/error.service';
import { User } from '../../../models/user.model';

/**
 * UserFormComponent
 *
 * Handles user creation and update operations.
 * Dynamically manages password validation
 * based on create or edit mode.
 */
@Component({
  selector: 'app-user-form',
  standalone: false,
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  /** Reactive form for user data */
  userForm: FormGroup;

  /** Toggles password visibility */
  hidePassword = true;

  /** Indicates edit mode */
  isEditMode = false;

  /** Stores current user ID (edit mode) */
  userId: number | null = null;

  /** Stores server-side validation or error message */
  serverMessage = '';

  /**
   * Initializes form controls and injects required services.
   */
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private errorService: ErrorService
  ) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      username: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', []]
    });
  }

  /**
   * Lifecycle hook.
   * Detects route parameter and configures
   * form validation based on mode.
   */
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.userId = +id;

      // Remove password validation in edit mode
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
      this.loadUser();
    } else {
      // Apply password validation in create mode
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(50)]);
      this.userForm.get('password')?.updateValueAndValidity();
    }
  }

  /**
   * Indicates whether password is required.
   */
  get passwordRequired(): boolean {
    return !this.isEditMode;
  }

  /**
   * Fetches user details and patches form values.
   */
  loadUser(): void {
    if (!this.userId) return;
    this.userService.getUser(this.userId).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          email: user.email,
          username: user.username
        });
      },
      error: (err) => {
        console.error(this.errorService.getMessage(err));
      }
    });
  }

  /**
   * Submits user form.
   * Creates new user or updates existing one
   * based on edit mode.
   */
  onSubmit(): void {
    if (this.userForm.invalid) return;
    this.serverMessage = '';
    const value = this.userForm.value;
    const user: User = {
      email: value.email,
      username: value.username,
      role: 'ADMIN',
      status: 'ACTIVE'
    };

    // Include password only during creation
    if (!this.isEditMode && value.password) {
      user.password = value.password;
    }

    if (this.isEditMode && this.userId) {
      user.id = this.userId;
      this.userService.updateUser(user).subscribe({
        next: () => {
          this.router.navigate(['/users']);
        },
        error: (err) => {
          this.serverMessage = this.errorService.applyFieldErrors(this.userForm, err);
        }
      });
    } else {
      this.userService.createUser(user).subscribe({
        next: () => {
          this.router.navigate(['/users']);
        },
        error: (err) => {
          this.serverMessage = this.errorService.applyFieldErrors(this.userForm, err);
        }
      });
    }
  }

}