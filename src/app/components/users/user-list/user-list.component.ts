import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ErrorService } from '../../../core/services/error.service';
import { User } from '../../../models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

/**
 * UserListComponent
 *
 * Displays a paginated and sortable list of users.
 * Provides actions for creating, editing,
 * and deleting user records.
 */
@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  /** Table column configuration */
  displayedColumns: string[] = ['id', 'username', 'email', 'role', 'status', 'actions'];

  /** User table data source */
  dataSource: User[] = [];

  /** Pagination state */
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25, 100];

  /** Sorting configuration */
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
    private userService: UserService,
    private errorService: ErrorService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  /**
   * Lifecycle hook.
   * Loads user data on component initialization.
   */
  ngOnInit(): void {
    this.loadUsers();
  }

  /**
   * Fetches user list with
   * pagination and sorting parameters.
   */
  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers(this.pageIndex, this.pageSize, this.sortField, this.sortDir).subscribe({
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
   * Handles pagination change event.
   */
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  /**
   * Toggles sorting direction
   * and reloads sorted data.
   */
  sortData(sortField: string): void {
    this.sortDir = this.sortField === sortField && this.sortDir === 'asc' ? 'desc' : 'asc';
    this.sortField = sortField;
    this.loadUsers();
  }

  /**
   * Navigates to edit user page.
   */
  editUser(id: number): void {
    this.router.navigate(['/users', id, 'edit']);
  }

  /**
   * Opens confirmation dialog and
   * deletes selected user.
   */
  deleteUser(user: User): void {
    if (!user.id) return;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Are you sure you want to delete this record?` },
      width: '400px'
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.userService.deleteUser(user.id!).subscribe({
          next: () => {
            this.successMessage = 'User deleted successfully';
            this.loadUsers();
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
   * Navigates to create new user page.
   */
  addUser(): void {
    this.router.navigate(['/users', 'new']);
  }

}