/**
 * LoginRequest
 *
 * Defines the request payload
 * for user authentication.
 */
export interface LoginRequest {

  companyCode: string;

  username: string;

  password: string;

}

/**
 * LoginResponse
 *
 * Defines the response payload
 * returned after successful authentication.
 */
export interface LoginResponse {

  /** JWT authentication token */
  token: string;

}

/**
 * RegisterRequest
 *
 * Defines the request payload
 * for tenant registration.
 */
export interface RegisterRequest {

  companyCode: string;

  companyName: string;

  companyEmail: string;

  adminUsername: string;

  adminEmail: string;

  adminPassword: string;

}