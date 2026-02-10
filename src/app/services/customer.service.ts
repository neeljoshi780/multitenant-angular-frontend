import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../core/config/api.config';
import { Customer } from '../models/customer.model';
import { PageResponse } from '../models/page-response.model';

/**
 * CustomerService
 *
 * Handles customer-related API operations
 * including CRUD and paginated retrieval.
 */
@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  /** Base customer API URL */
  private readonly apiUrl = `${API_CONFIG.baseUrl}${API_CONFIG.customer}`;

  /**
   * Injects HttpClient for API communication.
   */
  constructor(private http: HttpClient) { }

  /**
   * Retrieves paginated customer list
   * with optional sorting and search filter.
   *
   * @param pageNo Page number (default: 0)
   * @param pageSize Records per page (default: 10)
   * @param sortBy Field name for sorting
   * @param sortDir Sort direction ('asc' | 'desc')
   * @param search Optional search keyword
   * @returns Observable containing PageResponse<Customer>
   */
  getCustomers(
    pageNo = 0,
    pageSize = 10,
    sortBy = 'id',
    sortDir = 'asc',
    search = ''
  ): Observable<PageResponse<Customer>> {
    let params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<PageResponse<Customer>>(this.apiUrl, { params });
  }

  /**
   * Retrieves customer details by ID.
   *
   * @param id Customer identifier
   * @returns Observable containing Customer data
   */
  getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  /**
   * Creates a new customer record.
   *
   * @param customer Customer payload
   * @returns Observable containing created Customer
   */
  createCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer);
  }

  /**
   * Updates an existing customer record.
   *
   * @param customer Updated customer payload
   * @returns Observable containing updated Customer
   */
  updateCustomer(customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(this.apiUrl, customer);
  }

  /**
   * Deletes a customer by ID.
   *
   * @param id Customer identifier
   * @returns Observable<void>
   */
  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}