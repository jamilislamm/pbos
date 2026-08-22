/**
 * DomainValidator
 * Shared validation helpers used across the domain layer.
 *
 * Architecture: APPLICATION_LOGIC.md §6 (Command Lifecycle)
 * DATA_ARCHITECTURE.md §7 (Entity IDs), §8 (Timestamps)
 */

/**
 * Validate that a value is a non-empty string.
 * @param {*} value
 * @param {string} fieldName
 * @returns {{valid: boolean, error?: string}}
 */
export function validateNonEmptyString(value, fieldName) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return { valid: false, error: `${fieldName} must be a non-empty string` };
  }
  return { valid: true };
}

/**
 * Validate that a value is a positive integer.
 * @param {*} value
 * @param {string} fieldName
 * @returns {{valid: boolean, error?: string}}
 */
export function validatePositiveInteger(value, fieldName) {
  if (!Number.isInteger(value) || value <= 0) {
    return { valid: false, error: `${fieldName} must be a positive integer` };
  }
  return { valid: true };
}

/**
 * Validate that a value is a non-negative integer.
 * @param {*} value
 * @param {string} fieldName
 * @returns {{valid: boolean, error?: string}}
 */
export function validateNonNegativeInteger(value, fieldName) {
  if (!Number.isInteger(value) || value < 0) {
    return {
      valid: false,
      error: `${fieldName} must be a non-negative integer`,
    };
  }
  return { valid: true };
}

/**
 * Validate UUID format (simple check).
 * Architecture: DATA_ARCHITECTURE.md §7 — IDs must be stable and unique.
 * @param {string} id
 * @param {string} fieldName
 * @returns {{valid: boolean, error?: string}}
 */
export function validateId(id, fieldName = "id") {
  if (typeof id !== "string" || id.trim().length === 0) {
    return { valid: false, error: `${fieldName} must be a non-empty string` };
  }
  // Allow any reasonable ID format (UUID v4, nanoid, etc.)
  // Minimum length check to catch obvious errors
  if (id.length < 4) {
    return { valid: false, error: `${fieldName} is too short` };
  }
  return { valid: true };
}

/**
 * Validate a timestamp is a valid Date or Unix timestamp.
 * @param {*} value
 * @param {string} fieldName
 * @returns {{valid: boolean, error?: string}}
 */
export function validateTimestamp(value, fieldName) {
  if (value instanceof Date) {
    if (isNaN(value.getTime())) {
      return { valid: false, error: `${fieldName} is an invalid Date` };
    }
    return { valid: true };
  }
  if (typeof value === "number") {
    if (value <= 0 || !Number.isFinite(value)) {
      return {
        valid: false,
        error: `${fieldName} must be a positive timestamp`,
      };
    }
    return { valid: true };
  }
  return {
    valid: false,
    error: `${fieldName} must be a Date or positive number`,
  };
}

/**
 * Validate that a value is one of the allowed enum values.
 * @param {*} value
 * @param {Object} enumObj
 * @param {string} fieldName
 * @returns {{valid: boolean, error?: string}}
 */
export function validateEnum(value, enumObj, fieldName) {
  const allowed = Object.values(enumObj);
  if (!allowed.includes(value)) {
    return {
      valid: false,
      error: `${fieldName} must be one of: ${allowed.join(", ")}`,
    };
  }
  return { valid: true };
}

/**
 * Combine multiple validation results.
 * Returns the first error found, or success if all pass.
 * @param {...{valid: boolean, error?: string}} results
 * @returns {{valid: boolean, errors: string[]}}
 */
export function combineValidations(...results) {
  const errors = results.filter((r) => !r.valid).map((r) => r.error);
  return { valid: errors.length === 0, errors };
}
