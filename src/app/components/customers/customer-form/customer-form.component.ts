import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { ErrorService } from '../../../core/services/error.service';
import { Customer } from '../../../models/customer.model';

/**
 * CustomerFormComponent
 *
 * Handles customer creation and update operations.
 * Uses reactive forms with validation and integrates
 * with CustomerService for API communication.
 */
@Component({
  selector: 'app-customer-form',
  standalone: false,
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit {

  /** Reactive form for customer data */
  customerForm: FormGroup;

  /** Indicates whether component is in edit mode */
  isEditMode = false;

  /** Stores current customer ID (for edit mode) */
  customerId: number | null = null;

  /** Stores server-side validation or error message */
  serverMessage = '';

  /**
   * Maximum selectable date for Date of Birth.
   * Prevents selecting future dates.
   */
  maxDate: Date = new Date();

  /**
   * Initializes form controls with validations
   * and injects required services.
   */
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private errorService: ErrorService
  ) {

    /**
     * Initialize Reactive Form with validations.
     * Age field is disabled because it is auto-calculated.
     */
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
      dateOfBirth: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^[6-9][0-9]{9}$/)]],
      email: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      age: [{ value: '', disabled: true }], // Auto-calculated field
      gender: ['', Validators.required],
      address1: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-z0-9,.\-/#\s\r\n]+$/)
      ]],
      address2: ['', [
        Validators.pattern(/^[A-Za-z0-9,.\-/#\s\r\n]+$/)
      ]]
    });
  }

  /** 
   * Lifecycle hook.
   * Detects route parameter and loads customer
   * data if in edit mode.
   */
  ngOnInit(): void {

    /**
     * Automatically calculate Age when Date of Birth changes.
     */
    this.customerForm.get('dateOfBirth')?.valueChanges.subscribe(date => {
      if (date) {
        const calculatedAge = this.calculateAge(date);
        this.customerForm.get('age')?.setValue(calculatedAge);
      } else {
        this.customerForm.get('age')?.setValue('');
      }
    });

    /**
     * Check route parameter to determine edit mode.
     */
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.customerId = +id;
      this.loadCustomer();
    }
  }

  /**
   * Fetches customer details by ID
   * and patches form values.
   * Also recalculates age from stored Date of Birth.
   */
  loadCustomer(): void {
    if (!this.customerId) return;

    this.customerService.getCustomer(this.customerId).subscribe({
      next: (customer) => {

        const dob = new Date(customer.dateOfBirth);
        const calculatedAge = this.calculateAge(dob);

        this.customerForm.patchValue({
          firstName: customer.firstName,
          lastName: customer.lastName,
          dateOfBirth: dob,
          mobile: customer.mobile,
          email: customer.email,
          age: calculatedAge,
          gender: customer.gender?.toUpperCase(),
          address1: customer.address1,
          address2: customer.address2 || ''
        });
      },
      error: (err) => {
        console.error(this.errorService.getMessage(err));
      }
    });
  }

  /**
   * Calculates age based on Date of Birth.
   * Ensures accurate calculation considering month and day.
   */
  calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age >= 0 ? age : 0;
  }

  /**
   * Submits the form.
   * Creates new customer or updates existing one
   * based on edit mode.
   */
  onSubmit(): void {
    if (this.customerForm.invalid) return;

    this.serverMessage = '';

    /**
     * getRawValue() is used to include disabled fields (age).
     */
    const rawValue = this.customerForm.getRawValue();

    const customer: Customer = {
      ...rawValue,
      dateOfBirth: rawValue.dateOfBirth?.toISOString()?.split('T')[0],
      age: rawValue.age,
      address2: rawValue.address2 || undefined
    };

    if (this.isEditMode && this.customerId) {

      customer.id = this.customerId;

      this.customerService.updateCustomer(customer).subscribe({
        next: () => this.router.navigate(['/customers']),
        error: (err) => {
          this.serverMessage =
            this.errorService.applyFieldErrors(this.customerForm, err);
        }
      });

    } else {

      this.customerService.createCustomer(customer).subscribe({
        next: () => this.router.navigate(['/customers']),
        error: (err) => {
          this.serverMessage =
            this.errorService.applyFieldErrors(this.customerForm, err);
        }
      });
    }
  }

  /**
   * Resets the customer form.
   */
  clear(): void {
    this.customerForm.reset();
  }

}