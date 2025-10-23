/**
 * Storage Module
 * Handles data persistence using localStorage
 */

const STORAGE_KEY = 'expenses';

/**
 * Loads expenses from localStorage
 * @returns {Array} Array of expense objects
 */
export function loadExpenses() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const parsed = JSON.parse(data);
    // Return empty array if parsed value is null or not an array
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load expenses:', error);
    return [];
  }
}

/**
 * Saves expenses to localStorage
 * @param {Array} expenses - Array of expense objects to save
 * @returns {boolean} Success status
 */
export function saveExpenses(expenses) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    return true;
  } catch (error) {
    console.error('Failed to save expenses:', error);
    return false;
  }
}

/**
 * Clears all expenses from localStorage
 * @returns {boolean} Success status
 */
export function clearExpenses() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear expenses:', error);
    return false;
  }
}
