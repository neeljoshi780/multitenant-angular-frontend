import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

/**
 * LayoutComponent
 *
 * Provides the main layout structure
 * for authenticated pages including
 * navigation and footer section.
 */
@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {

  /** Displays current year in footer */
  currentYear = new Date().getFullYear();

  /** State for mobile sidebar visibility */
  isSidebarOpen = false;

  /**
   * Injects authentication service
   * for managing user session.
   */
  constructor(public authService: AuthService) { }

  /**
   * Logs out the currently authenticated user
   * and clears session data.
   */
  logout(): void {
    this.authService.logout();
  }

  /**
   * Toggles the sidebar visibility on mobile devices.
   */
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  /**
   * Closes the sidebar on mobile devices.
   */
  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

}