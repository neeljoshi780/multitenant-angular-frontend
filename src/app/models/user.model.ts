/**
 * User
 *
 * Represents user entity data
 * within the tenant system.
 */
export interface User {

  id?: number;

  email: string;

  username: string;

  password?: string;

  role?: string;

  status?: string;

}