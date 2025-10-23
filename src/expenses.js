/**
 * Expenses Module
 * Handles CRUD operations for expense management
 */

import { generateId } from './utils.js';

/**
 * Valid expense categories
 */
export const VALID_CATEGORIES = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Other'
];

/**
 * Creates a new expense object
 * @param {Object} expenseData - Expense data
 * @param {string} expenseData.date - ISO date string
 * @param {number} expenseData.amount - Expense amount
 * @param {string} expenseData.category - Expense category
 * @param {string} expenseData.description - Expense description
 * @returns {Object} New expense object with generated ID
 */
export function createExpense({ date, amount, category, description }) {
  if (!date || amount === undefined || amount === null || !category || !description) {
    throw new Error('Missing required expense fields');
  }

  if (!VALID_CATEGORIES.includes(category)) {
    throw new Error(`Invalid category: ${category}`);
  }

  if (amount < 0) {
    throw new Error('Amount must be positive');
  }

  return {
    id: generateId(),
    date,
    amount: parseFloat(amount),
    category,
    description,
    createdAt: new Date().toISOString()
  };
}

/**
 * Updates an existing expense
 * @param {Array} expenses - Array of all expenses
 * @param {string} id - ID of expense to update
 * @param {Object} updates - Fields to update
 * @returns {Array} Updated expenses array
 */
export function updateExpense(expenses, id, updates) {
  const index = expenses.findIndex(exp => exp.id === id);

  if (index === -1) {
    throw new Error(`Expense with id ${id} not found`);
  }

  if (updates.category && !VALID_CATEGORIES.includes(updates.category)) {
    throw new Error(`Invalid category: ${updates.category}`);
  }

  if (updates.amount !== undefined && updates.amount < 0) {
    throw new Error('Amount must be positive');
  }

  const updatedExpenses = [...expenses];
  updatedExpenses[index] = {
    ...updatedExpenses[index],
    ...updates
  };

  return updatedExpenses;
}

/**
 * Deletes an expense by ID
 * @param {Array} expenses - Array of all expenses
 * @param {string} id - ID of expense to delete
 * @returns {Array} Updated expenses array without deleted expense
 */
export function deleteExpense(expenses, id) {
  const filtered = expenses.filter(exp => exp.id !== id);

  if (filtered.length === expenses.length) {
    throw new Error(`Expense with id ${id} not found`);
  }

  return filtered;
}

/**
 * Finds an expense by ID
 * @param {Array} expenses - Array of all expenses
 * @param {string} id - ID of expense to find
 * @returns {Object|null} Found expense or null
 */
export function findExpenseById(expenses, id) {
  return expenses.find(exp => exp.id === id) || null;
}

/**
 * Adds an expense to the expenses array
 * @param {Array} expenses - Array of all expenses
 * @param {Object} newExpense - New expense to add
 * @returns {Array} Updated expenses array
 */
export function addExpense(expenses, newExpense) {
  return [...expenses, newExpense];
}
