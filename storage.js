import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STORAGE_FILE = path.join(__dirname, 'expenses.json');

// Valid categories
export const CATEGORIES = ['food', 'transportation', 'entertainment', 'shopping', 'bills', 'other'];

// Category display information
export const CATEGORY_INFO = {
  food: { emoji: '🍔', color: 'orange' },
  transportation: { emoji: '🚗', color: 'blue' },
  entertainment: { emoji: '🎬', color: 'purple' },
  shopping: { emoji: '🛍️', color: 'pink' },
  bills: { emoji: '📄', color: 'red' },
  other: { emoji: '📦', color: 'gray' }
};

/**
 * Read all expenses from storage
 */
export function readExpenses() {
  try {
    if (!fs.existsSync(STORAGE_FILE)) {
      return [];
    }
    const data = fs.readFileSync(STORAGE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading expenses:', error.message);
    return [];
  }
}

/**
 * Write expenses to storage
 */
export function writeExpenses(expenses) {
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(expenses, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing expenses:', error.message);
    return false;
  }
}

/**
 * Add a new expense
 */
export function addExpense(expense) {
  const expenses = readExpenses();

  // Generate ID
  const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Create expense object
  const newExpense = {
    id,
    date: expense.date || new Date().toISOString().split('T')[0],
    amount: parseFloat(expense.amount),
    category: expense.category.toLowerCase(),
    description: expense.description,
    createdAt: new Date().toISOString()
  };

  // Validate
  if (!CATEGORIES.includes(newExpense.category)) {
    throw new Error(`Invalid category. Must be one of: ${CATEGORIES.join(', ')}`);
  }

  if (isNaN(newExpense.amount) || newExpense.amount <= 0) {
    throw new Error('Amount must be a positive number');
  }

  if (!newExpense.description || newExpense.description.trim() === '') {
    throw new Error('Description is required');
  }

  // Add to expenses
  expenses.push(newExpense);

  // Save
  if (!writeExpenses(expenses)) {
    throw new Error('Failed to save expense');
  }

  return newExpense;
}

/**
 * Delete an expense by ID
 */
export function deleteExpense(id) {
  const expenses = readExpenses();
  const filtered = expenses.filter(e => e.id !== id);

  if (filtered.length === expenses.length) {
    return false; // ID not found
  }

  return writeExpenses(filtered);
}

/**
 * Format currency
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

/**
 * Format date
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}
