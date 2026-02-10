import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { ErrorService } from '../../../core/services/error.service';
import { Customer } from '../../../models/customer.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

/**
 * CustomerListComponent
 *
 * Displays paginated, sortable, and searchable
 * customer data in a table format.
 * Handles navigation, deletion, and user interactions.
 */
@Component({
  selector: 'app-customer-list',
  standalone: false,
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

  /** Table column definitions */
  displayedColumns: string[] = ['id', 'name', 'email', 'mobile', 'gender', 'age', 'dateOfBirth', 'address', 'actions'];

  /** Customer data source */
  dataSource: Customer[] = [];

  /** Pagination and table state */
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25, 100];

  /** Search and sorting configuration */
  searchTerm = '';
  sortField = 'id';
  sortDir = 'asc';

  /** Loading indicator flag */
  loading = false;

  /** Success message for inline display */
  successMessage = '';

  /**
   * Injects required services for
   * data handling, navigation, dialogs, and notifications.
   */
  constructor(
    private customerService: CustomerService,
    private errorService: ErrorService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  /**
   * Lifecycle hook.
   * Loads customer data on component initialization.
   */
  ngOnInit(): void {
    this.loadCustomers();
  }

  /**
   * Fetches customer list with
   * pagination, sorting, and search parameters.
   */
  loadCustomers(): void {
    this.loading = true;
    this.customerService
      .getCustomers(this.pageIndex, this.pageSize, this.sortField, this.sortDir, this.searchTerm)
      .subscribe({
        next: (res) => {
          this.dataSource = res.content || [];
          this.totalElements = res.totalElements || 0;
        },
        error: (err) => {
          console.error(this.errorService.getMessage(err));
        },
        complete: () => (this.loading = false)
      });
  }

  /**
   * Applies search filter and reloads data.
   */
  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim();
    this.searchTerm = value;
    this.pageIndex = 0;
    this.loadCustomers();
  }

  /**
   * Handles pagination change event.
   */
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCustomers();
  }

  /**
   * Toggles sorting direction
   * and reloads sorted data.
   */
  sortData(sortField: string): void {
    this.sortDir = this.sortField === sortField && this.sortDir === 'asc' ? 'desc' : 'asc';
    this.sortField = sortField;
    this.loadCustomers();
  }

  /**
   * Navigates to edit customer page.
   */
  editCustomer(id: number): void {
    this.router.navigate(['/customers', id, 'edit']);
  }

  /**
   * Opens confirmation dialog and
   * deletes selected customer.
   */
  deleteCustomer(customer: Customer): void {
    if (!customer.id) return;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Are you sure you want to delete this record?` },
      width: '400px'
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.customerService.deleteCustomer(customer.id!).subscribe({
          next: () => {
            this.successMessage = 'Customer deleted successfully';
            this.loadCustomers();
            setTimeout(() => this.successMessage = '', 5000);
          },
          error: (err) => {
            console.error(this.errorService.getMessage(err));
          }
        });
      }
    });
  }

  /**
   * Navigates to create new customer page.
   */
  addCustomer(): void {
    this.router.navigate(['/customers', 'new']);
  }

}