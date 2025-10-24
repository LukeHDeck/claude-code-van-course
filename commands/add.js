import { addExpense, formatCurrency, formatDate, CATEGORIES, CATEGORY_INFO } from '../storage.js';

/**
 * Parse command line arguments
 */
function parseArgs(args) {
  const parsed = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '-a' || arg === '--amount') {
      parsed.amount = args[++i];
    } else if (arg === '-c' || arg === '--category') {
      parsed.category = args[++i];
    } else if (arg === '-d' || arg === '--description') {
      parsed.description = args[++i];
    } else if (arg === '--date') {
      parsed.date = args[++i];
    }
  }

  return parsed;
}

/**
 * Validate date format (YYYY-MM-DD)
 */
function isValidDate(dateString) {
  if (!dateString) return true; // Optional, will use today
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

/**
 * Add command handler
 */
export async function addCommand(args) {
  const options = parseArgs(args);

  // Validate required fields
  if (!options.amount) {
    throw new Error('Amount is required. Use -a or --amount');
  }

  if (!options.category) {
    throw new Error('Category is required. Use -c or --category');
  }

  if (!options.description) {
    throw new Error('Description is required. Use -d or --description');
  }

  // Validate date format if provided
  if (options.date && !isValidDate(options.date)) {
    throw new Error('Invalid date format. Use YYYY-MM-DD');
  }

  // Validate category
  if (!CATEGORIES.includes(options.category.toLowerCase())) {
    throw new Error(`Invalid category '${options.category}'. Valid categories: ${CATEGORIES.join(', ')}`);
  }

  // Add the expense
  const expense = addExpense(options);

  // Display success message
  const categoryEmoji = CATEGORY_INFO[expense.category].emoji;
  console.log('\n✅ Expense added successfully!\n');
  console.log(`${categoryEmoji} ${expense.category.toUpperCase()}`);
  console.log(`💰 Amount: ${formatCurrency(expense.amount)}`);
  console.log(`📅 Date: ${formatDate(expense.date)}`);
  console.log(`📝 Description: ${expense.description}`);
  console.log(`🆔 ID: ${expense.id}\n`);
}
