/**
 * Filters Module
 * Handles filtering and searching of expenses
 */

/**
 * Filters expenses by category
 * @param {Array} expenses - Array of expense objects
 * @param {string} category - Category to filter by ('All' for no filter)
 * @returns {Array} Filtered expenses
 */
export function filterByCategory(expenses, category) {
  if (category === 'All' || !category) {
    return expenses;
  }
  return expenses.filter(exp => exp.category === category);
}

/**
 * Searches expenses by description or category (case-insensitive)
 * @param {Array} expenses - Array of expense objects
 * @param {string} query - Search query string
 * @returns {Array} Filtered expenses matching search query
 */
export function searchExpenses(expenses, query) {
  if (!query || query.trim() === '') {
    return expenses;
  }

  const lowerQuery = query.toLowerCase().trim();

  return expenses.filter(exp => {
    const descriptionMatch = exp.description.toLowerCase().includes(lowerQuery);
    const categoryMatch = exp.category.toLowerCase().includes(lowerQuery);
    return descriptionMatch || categoryMatch;
  });
}

/**
 * Filters and searches expenses with combined filters
 * @param {Array} expenses - Array of expense objects
 * @param {Object} filters - Filter options
 * @param {string} [filters.category='All'] - Category filter
 * @param {string} [filters.search=''] - Search query
 * @returns {Array} Filtered expenses
 */
export function applyFilters(expenses, { category = 'All', search = '' } = {}) {
  let filtered = expenses;

  // Apply category filter
  filtered = filterByCategory(filtered, category);

  // Apply search filter
  filtered = searchExpenses(filtered, search);

  return filtered;
}

/**
 * Sorts expenses by date
 * @param {Array} expenses - Array of expense objects
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Array} Sorted expenses
 */
export function sortByDate(expenses, order = 'desc') {
  const sorted = [...expenses].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });

  return sorted;
}

/**
 * Sorts expenses by amount
 * @param {Array} expenses - Array of expense objects
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Array} Sorted expenses
 */
export function sortByAmount(expenses, order = 'desc') {
  const sorted = [...expenses].sort((a, b) => {
    return order === 'asc' ? a.amount - b.amount : b.amount - a.amount;
  });

  return sorted;
}

/**
 * Gets expenses above a certain amount
 * @param {Array} expenses - Array of expense objects
 * @param {number} minAmount - Minimum amount threshold
 * @returns {Array} Filtered expenses
 */
export function getExpensesAboveAmount(expenses, minAmount) {
  return expenses.filter(exp => exp.amount >= minAmount);
}

/**
 * Gets expenses below a certain amount
 * @param {Array} expenses - Array of expense objects
 * @param {number} maxAmount - Maximum amount threshold
 * @returns {Array} Filtered expenses
 */
export function getExpensesBelowAmount(expenses, maxAmount) {
  return expenses.filter(exp => exp.amount <= maxAmount);
}
