/**
 * Statistics Module
 * Calculates various statistics and analytics for expenses
 */

/**
 * Calculates comprehensive statistics from expenses array
 * @param {Array} expenses - Array of expense objects
 * @param {Date} [referenceDate=new Date()] - Reference date for monthly calculations
 * @returns {Object} Statistics object containing totals and breakdowns
 */
export function calculateStats(expenses, referenceDate = new Date()) {
  const currentMonth = referenceDate.getMonth();
  const currentYear = referenceDate.getFullYear();

  // Calculate total spending across all expenses
  const totalSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Filter expenses for current month and year
  const monthlyExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
  });

  const monthlySpending = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Calculate spending by category
  const categoryBreakdown = {
    'Food': 0,
    'Transportation': 0,
    'Entertainment': 0,
    'Shopping': 0,
    'Bills': 0,
    'Other': 0
  };

  expenses.forEach(exp => {
    if (categoryBreakdown.hasOwnProperty(exp.category)) {
      categoryBreakdown[exp.category] += exp.amount;
    }
  });

  // Determine top spending category
  let topCategory = 'Other';
  let maxAmount = 0;

  Object.keys(categoryBreakdown).forEach(category => {
    if (categoryBreakdown[category] > maxAmount) {
      maxAmount = categoryBreakdown[category];
      topCategory = category;
    }
  });

  return {
    totalSpending,
    monthlySpending,
    categoryBreakdown,
    topCategory,
    expenseCount: expenses.length
  };
}

/**
 * Calculates average expense amount
 * @param {Array} expenses - Array of expense objects
 * @returns {number} Average amount
 */
export function calculateAverageExpense(expenses) {
  if (expenses.length === 0) return 0;
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  return total / expenses.length;
}

/**
 * Gets expenses for a specific date range
 * @param {Array} expenses - Array of expense objects
 * @param {Date} startDate - Start date (inclusive)
 * @param {Date} endDate - End date (inclusive)
 * @returns {Array} Filtered expenses
 */
export function getExpensesByDateRange(expenses, startDate, endDate) {
  return expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate >= startDate && expDate <= endDate;
  });
}

/**
 * Gets total spending for a specific category
 * @param {Array} expenses - Array of expense objects
 * @param {string} category - Category name
 * @returns {number} Total spending for category
 */
export function getCategoryTotal(expenses, category) {
  return expenses
    .filter(exp => exp.category === category)
    .reduce((sum, exp) => sum + exp.amount, 0);
}
