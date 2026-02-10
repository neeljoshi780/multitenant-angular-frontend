import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

/**
 * ConfirmDialogComponent
 *
 * Reusable confirmation dialog used for
 * critical actions such as delete operations.
 * Accepts dynamic title and message via dialog data.
 */
@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.title || 'Confirm Delete' }}</h2>
    <mat-dialog-content>{{ data.message }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">Cancel</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">Delete</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogComponent {

  /**
   * Injects dialog data (title, message)
   * and dialog reference for controlling dialog state.
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { message: string; title?: string },
    public dialogRef: MatDialogRef<ConfirmDialogComponent>
  ) { }

}