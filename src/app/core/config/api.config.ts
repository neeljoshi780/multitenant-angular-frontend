/**
 * API_CONFIG
 *
 * Centralized API endpoint configuration.
 * Defines base URL and controller-specific paths.
 * Environment files are not used in this setup.
 */
export const API_CONFIG = {

  /** Base URL of backend application */
  baseUrl: 'http://localhost:8080',

  /** Authentication-related endpoints */
  auth: '/api/auth',

  /** Tenant administration endpoints */
  tenantAdmin: '/api/admin/tenant',

  /** Customer management endpoints */
  customer: '/api/customer',

  /** User management endpoints */
  user: '/api/user'

} as const;