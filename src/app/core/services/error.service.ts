import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponse } from '../../models/error-response.model';
import { FormGroup } from '@angular/forms';

/**
 * ErrorService
 *
 * Provides utility methods for handling
 * backend HTTP errors and mapping them
 * to user-friendly messages or form controls.
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  /**
   * Extracts and maps backend error response
   * into standardized ErrorResponse format.
   *
   * @param err HTTP error response
   * @returns Parsed ErrorResponse or null
   */
  parseError(err: HttpErrorResponse): ErrorResponse | null {
    const body = err?.error;
    if (!body) return null;

    return {
      timestamp: body.timestamp,
      status: body.status ?? err.status,
      error: body.error,
      message: body.message,
      path: body.path,
      fieldErrors: body.fieldErrors
    };
  }

  /**
   * Returns a user-friendly error message.
   * Falls back to default message if unavailable.
   *
   * @param err HTTP error response
   * @returns Error message string
   */
  getMessage(err: HttpErrorResponse): string {
    const parsed = this.parseError(err);
    return parsed?.message || err?.message || 'An error occurred. Please try again.';
  }

  /**
   * Maps backend field validation errors
   * to corresponding Angular form controls.
   * Clears previous server errors before applying new ones.
   *
   * @param form Target FormGroup
   * @param err HTTP error response
   * @returns First available field error or general message
   */
  applyFieldErrors(form: FormGroup, err: HttpErrorResponse): string {
    const parsed = this.parseError(err);
    if (!parsed) return this.getMessage(err);

    // Remove existing server-side errors
    Object.keys(form.controls).forEach((key) => {
      const ctrl = form.get(key);
      if (ctrl?.errors?.['serverError']) {
        const { serverError, ...rest } = ctrl.errors;
        ctrl.setErrors(Object.keys(rest).length ? rest : null);
      }
    });

    let firstErrorMessage = '';
    const fieldErrors = parsed.fieldErrors;
    if (fieldErrors && Object.keys(fieldErrors).length > 0) {
      Object.keys(fieldErrors).forEach((fieldName) => {
        const control = form.get(fieldName);
        const errorMsg = fieldErrors[fieldName];
        if (!firstErrorMessage) firstErrorMessage = errorMsg;

        if (control) {
          const existing = control.errors || {};
          control.setErrors({ ...existing, serverError: errorMsg });
          control.markAsTouched();
        }
      });
    }
    return firstErrorMessage || parsed.message || '';
  }

}