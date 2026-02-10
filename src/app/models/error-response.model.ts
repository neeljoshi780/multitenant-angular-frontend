/**
 * ErrorResponse
 *
 * Represents standard error structure
 * returned from backend APIs.
 * Mirrors the server-side ErrorResponseDto.
 */
export interface ErrorResponse {

  timestamp?: string;

  status: number;

  error?: string;

  message?: string;

  path?: string;

  fieldErrors?: Record<string, string>;

}