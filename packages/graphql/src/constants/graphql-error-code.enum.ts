export enum GraphqlErrorCode {
  /**
   * Input is syntactically valid but violates business rules,
   * e.g., invalid format, missing required fields, or constraint violations.
   * Example: "email must be a valid email address"
   */
  BAD_USER_INPUT = 'BAD_USER_INPUT',

  /**
   * The request is unauthenticated (e.g., missing or invalid access token).
   * Use this when authentication is required but not provided or invalid.
   * Example: "Access token expired or not provided"
   */
  UNAUTHENTICATED = 'UNAUTHENTICATED',

  /**
   * The user is authenticated but lacks the required permissions.
   * Use this for access control violations.
   * Example: "User does not have permission to delete this resource"
   */
  FORBIDDEN = 'FORBIDDEN',

  /**
   * The requested resource does not exist.
   * Example: "User with ID 123 not found"
   */
  NOT_FOUND = 'NOT_FOUND',

  /**
   * The request could not be completed due to a conflict with the current state.
   * Example: "Email already exists", "Username taken"
   */
  CONFLICT = 'CONFLICT',

  /**
   * The operation is not allowed in the current context.
   * Use this when a prerequisite condition is missing.
   * Example: "You must verify your email before proceeding"
   */
  FAILED_PRECONDITION = 'FAILED_PRECONDITION',

  /**
   * A generic internal error occurred.
   * Use only when no other error code applies or in catch-all fallback cases.
   * Example: "Unexpected error while processing request"
   */
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}
