/**
 * Utility Functions Module
 * Provides helper functions for formatting and ID generation
 */

/**
 * Formats a number as US currency
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string (e.g., "$1,234.56")
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

/**
 * Formats a date string to a human-readable format
 * @param {string} dateString - ISO date string or valid date string
 * @returns {string} Formatted date (e.g., "Jan 15, 2024")
 */
export function formatDate(dateString) {
  const date = new Date(dateString);

  // Check if date is invalid
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

/**
 * Generates a unique ID using timestamp and random string
 * @returns {string} Unique identifier (e.g., "1640000000000-abc123xyz")
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
