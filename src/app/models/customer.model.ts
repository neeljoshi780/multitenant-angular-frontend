/**
 * Customer
 *
 * Represents customer entity data
 * within the tenant system.
 */
export interface Customer {

  id?: number;

  firstName: string;

  lastName: string;

  dateOfBirth: string;

  age: number;

  gender: string;

  mobile: string;

  email: string;

  address1: string;

  address2?: string;

}