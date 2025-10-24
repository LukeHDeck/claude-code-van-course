import { readExpenses, formatCurrency, CATEGORY_INFO } from '../storage.js';

/**
 * Parse command line arguments
 */
function parseArgs(args) {
  const parsed = {
    month: null,
    category: null
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '-m' || arg === '--month') {
      parsed.month = args[++i];
    } else if (arg === '-c' || arg === '--category') {
      parsed.category = args[++i];
    }
  }

  return parsed;
}

/**
 * Filter expenses by month (YYYY-MM format)
 */
function filterByMonth(expenses, month) {
  if (!month) return expenses;

  return expenses.filter(expense => {
    const expenseMonth = expense.date.substring(0, 7); // Get YYYY-MM
    return expenseMonth === month;
  });
}

/**
 * Filter expenses by category
 */
function filterByCategory(expenses, category) {
  if (!category) return expenses;

  return expenses.filter(expense =>
    expense.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Calculate statistics
 */
function calculateStats(expenses) {
  if (expenses.length === 0) {
    return {
      total: 0,
      count: 0,
      average: 0,
      byCategory: {}
    };
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const count = expenses.length;
  const average = total / count;

  // Group by category
  const byCategory = {};
  expenses.forEach(expense => {
    if (!byCategory[expense.category]) {
      byCategory[expense.category] = {
        total: 0,
        count: 0,
        percentage: 0
      };
    }
    byCategory[expense.category].total += expense.amount;
    byCategory[expense.category].count += 1;
  });

  // Calculate percentages
  Object.keys(byCategory).forEach(category => {
    byCategory[category].percentage = (byCategory[category].total / total) * 100;
  });

  return {
    total,
    count,
    average,
    byCategory
  };
}

/**
 * Display summary
 */
function displaySummary(stats, options) {
  console.log('\n📈 EXPENSE SUMMARY\n');
  console.log('━'.repeat(80));

  // Display filter info
  if (options.month) {
    const [year, month] = options.month.split('-');
    const monthName = new Date(`${year}-${month}-01`).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    console.log(`📅 Period: ${monthName}`);
  }

  if (options.category) {
    console.log(`🏷️  Category: ${options.category}`);
  }

  console.log('━'.repeat(80));

  // Overall statistics
  console.log(`\n💰 Total Spending: ${formatCurrency(stats.total)}`);
  console.log(`📝 Total Expenses: ${stats.count}`);
  console.log(`📊 Average per Expense: ${formatCurrency(stats.average)}`);

  // Category breakdown
  if (Object.keys(stats.byCategory).length > 0 && !options.category) {
    console.log('\n📋 BREAKDOWN BY CATEGORY\n');
    console.log('━'.repeat(80));

    // Sort categories by total spending
    const sortedCategories = Object.entries(stats.byCategory)
      .sort(([, a], [, b]) => b.total - a.total);

    sortedCategories.forEach(([category, data]) => {
      const emoji = CATEGORY_INFO[category].emoji;
      const percentage = data.percentage.toFixed(1);
      const bar = '█'.repeat(Math.round(data.percentage / 5)); // Scale to max 20 chars

      console.log(`${emoji} ${category.toUpperCase().padEnd(15)} ${formatCurrency(data.total).padStart(10)} (${percentage}%)`);
      console.log(`   ${bar} ${data.count} transaction(s)`);
      console.log('─'.repeat(80));
    });
  }

  console.log('');
}

/**
 * Summary command handler
 */
export async function summaryCommand(args) {
  const options = parseArgs(args);
  let expenses = readExpenses();

  // Validate month format if provided
  if (options.month && !/^\d{4}-\d{2}$/.test(options.month)) {
    throw new Error('Invalid month format. Use YYYY-MM (e.g., 2025-10)');
  }

  // Apply filters
  expenses = filterByMonth(expenses, options.month);
  expenses = filterByCategory(expenses, options.category);

  if (expenses.length === 0) {
    console.log('\n📭 No expenses found for the specified criteria.\n');
    return;
  }

  // Calculate and display statistics
  const stats = calculateStats(expenses);
  displaySummary(stats, options);
}
