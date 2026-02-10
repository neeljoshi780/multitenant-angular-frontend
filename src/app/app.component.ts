import { Component } from '@angular/core';

/**
 * AppComponent
 * 
 * Root component of the application.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  /** Application title */
  title = 'multitenant-angular-frontend';
}