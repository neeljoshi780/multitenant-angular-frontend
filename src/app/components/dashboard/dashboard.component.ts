import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { UserService } from '../../services/user.service';

/**
 * DashboardComponent
 *
 * Displays summary statistics such as
 * total customers and total users.
 */
@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  /** Stores total number of customers */
  totalCustomers = 0;

  /** Stores total number of users */
  totalUsers = 0;

  /** Indicates data loading state */
  loading = true;

  /**
   * Injects required services for
   * fetching dashboard statistics.
   */
  constructor(
    private customerService: CustomerService,
    private userService: UserService
  ) { }

  /**
   * Lifecycle hook.
   * Loads dashboard counts on initialization.
   */
  ngOnInit(): void {
    this.loadCounts();
  }

  /**
   * Retrieves customer and user counts
   * from backend services.
   */
  loadCounts(): void {
    // Fetch customer count
    this.customerService.getCustomers(0, 1, 'id', 'asc', '').subscribe({
      next: (res) => {
        this.totalCustomers = res.totalElements;
      },
      error: () => (this.totalCustomers = 0)
    });

    // Fetch user count
    this.userService.getUsers(0, 1, 'id', 'asc').subscribe({
      next: (res) => {
        this.totalUsers = res.totalElements;
      },
      error: () => (this.totalUsers = 0),
      complete: () => (this.loading = false)
    });
  }

}