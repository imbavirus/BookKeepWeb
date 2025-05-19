
/**
 * Represents the structure of error data returned from the API.
 * This interface is typically used to type the JSON body of an error response.
 */
export interface IApiError {
  /** A general error message describing the issue. */
  message : string;
  /**
   * An optional object containing field-specific validation errors.
   * The keys are typically the field names, and the values are the error messages for those fields.
   */
  errors : { [key : string] : Array<string> };
}

/**
 * Custom error class for representing errors originating from API interactions.
 * It extends the built-in `Error` class to include additional context like
 * HTTP status code and field-specific validation errors.
 */
export class ApiError extends Error {
  /** The HTTP status code associated with the API error (e.g., 400, 404, 500). */
  public statusCode : number;
  /**
   * An optional object containing field-specific validation errors.
   * The keys are typically the field names, and the values are the error messages for those fields.
   */
  public errors ?: { [key : string] : Array<string> };

  /**
   * Constructs an `ApiError` instance.
   * @param {string} message - A general error message describing the issue.
   * @param {number} statusCode - The HTTP status code associated with the error.
   * @param {{ [key: string]: Array<string> }} [errors] - Optional field-specific validation errors.
   */
  constructor(
    message : string,
    statusCode : number,
    errors ?: { [key : string] : Array<string> }
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
