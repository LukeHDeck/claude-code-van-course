import { readExpenses, formatCurrency, formatDate, CATEGORY_INFO } from '../storage.js';

/**
 * Parse command line arguments
 */
function parseArgs(args) {
  const parsed = {
    category: null,
    search: null,
    limit: null,
    sort: 'date'
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '-c' || arg === '--category') {
      parsed.category = args[++i];
    } else if (arg === '-s' || arg === '--search') {
      parsed.search = args[++i];
    } else if (arg === '-l' || arg === '--limit') {
      parsed.limit = parseInt(args[++i]);
    } else if (arg === '--sort') {
      parsed.sort = args[++i];
    }
  }

  return parsed;
}

/**
 * Filter and sort expenses
 */
function filterExpenses(expenses, options) {
  let filtered = [...expenses];

  // Filter by category
  if (options.category) {
    filtered = filtered.filter(e =>
      e.category.toLowerCase() === options.category.toLowerCase()
    );
  }

  // Filter by search term
  if (options.search) {
    const searchLower = options.search.toLowerCase();
    filtered = filtered.filter(e =>
      e.description.toLowerCase().includes(searchLower)
    );
  }

  // Sort
  filtered.sort((a, b) => {
    if (options.sort === 'amount') {
      return b.amount - a.amount;
    } else if (options.sort === 'category') {
      return a.category.localeCompare(b.category);
    } else {
      // Default: sort by date (newest first)
      return new Date(b.date) - new Date(a.date);
    }
  });

  // Limit results
  if (options.limit && options.limit > 0) {
    filtered = filtered.slice(0, options.limit);
  }

  return filtered;
}

/**
 * Display expenses in a table format
 */
function displayExpenses(expenses) {
  if (expenses.length === 0) {
    console.log('\n📭 No expenses found.\n');
    return;
  }

  console.log(`\n📊 Found ${expenses.length} expense(s)\n`);
  console.log('━'.repeat(80));

  expenses.forEach(expense => {
    const categoryEmoji = CATEGORY_INFO[expense.category].emoji;
    const amount = formatCurrency(expense.amount);
    const date = formatDate(expense.date);

    console.log(`${categoryEmoji} ${expense.category.toUpperCase().padEnd(15)} ${amount.padStart(10)} ${date.padStart(15)}`);
    console.log(`   ${expense.description}`);
    console.log(`   ID: ${expense.id}`);
    console.log('─'.repeat(80));
  });

  // Calculate total
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  console.log(`\n💰 Total: ${formatCurrency(total)}\n`);
}

/**
 * List command handler
 */
export async function listCommand(args) {
  const options = parseArgs(args);
  const expenses = readExpenses();

  // Validate sort option
  const validSortOptions = ['date', 'amount', 'category'];
  if (!validSortOptions.includes(options.sort)) {
    throw new Error(`Invalid sort option. Valid options: ${validSortOptions.join(', ')}`);
  }

  const filtered = filterExpenses(expenses, options);
  displayExpenses(filtered);
}
