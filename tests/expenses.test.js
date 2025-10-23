/**
 * Expenses Module Tests
 * Comprehensive tests for CRUD operations
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  createExpense,
  updateExpense,
  deleteExpense,
  findExpenseById,
  addExpense,
  VALID_CATEGORIES
} from '../src/expenses.js';

describe('Expenses Module', () => {
  describe('VALID_CATEGORIES', () => {
    it('should contain all expected categories', () => {
      expect(VALID_CATEGORIES).toContain('Food');
      expect(VALID_CATEGORIES).toContain('Transportation');
      expect(VALID_CATEGORIES).toContain('Entertainment');
      expect(VALID_CATEGORIES).toContain('Shopping');
      expect(VALID_CATEGORIES).toContain('Bills');
      expect(VALID_CATEGORIES).toContain('Other');
    });

    it('should have exactly 6 categories', () => {
      expect(VALID_CATEGORIES).toHaveLength(6);
    });
  });

  describe('createExpense', () => {
    describe('Happy Path', () => {
      it('should create expense with all required fields', () => {
        const expenseData = {
          date: '2024-01-15',
          amount: 50.00,
          category: 'Food',
          description: 'Lunch at restaurant'
        };

        const expense = createExpense(expenseData);

        expect(expense).toHaveProperty('id');
        expect(expense).toHaveProperty('createdAt');
        expect(expense.date).toBe('2024-01-15');
        expect(expense.amount).toBe(50);
        expect(expense.category).toBe('Food');
        expect(expense.description).toBe('Lunch at restaurant');
      });

      it('should generate unique IDs for each expense', () => {
        const expenseData = {
          date: '2024-01-15',
          amount: 50,
          category: 'Food',
          description: 'Test'
        };

        const expense1 = createExpense(expenseData);
        const expense2 = createExpense(expenseData);

        expect(expense1.id).not.toBe(expense2.id);
      });

      it('should set createdAt timestamp', () => {
        const expense = createExpense({
          date: '2024-01-15',
          amount: 50,
          category: 'Food',
          description: 'Test'
        });

        expect(expense.createdAt).toBeDefined();
        expect(new Date(expense.createdAt)).toBeInstanceOf(Date);
      });

      it('should convert string amount to number', () => {
        const expense = createExpense({
          date: '2024-01-15',
          amount: '75.50',
          category: 'Food',
          description: 'Test'
        });

        expect(typeof expense.amount).toBe('number');
        expect(expense.amount).toBe(75.50);
      });
    });

    describe('Error Handling', () => {
      it('should throw error when date is missing', () => {
        expect(() => {
          createExpense({
            amount: 50,
            category: 'Food',
            description: 'Test'
          });
        }).toThrow('Missing required expense fields');
      });

      it('should throw error when amount is missing', () => {
        expect(() => {
          createExpense({
            date: '2024-01-15',
            category: 'Food',
            description: 'Test'
          });
        }).toThrow('Missing required expense fields');
      });

      it('should throw error when category is missing', () => {
        expect(() => {
          createExpense({
            date: '2024-01-15',
            amount: 50,
            description: 'Test'
          });
        }).toThrow('Missing required expense fields');
      });

      it('should throw error when description is missing', () => {
        expect(() => {
          createExpense({
            date: '2024-01-15',
            amount: 50,
            category: 'Food'
          });
        }).toThrow('Missing required expense fields');
      });

      it('should throw error for invalid category', () => {
        expect(() => {
          createExpense({
            date: '2024-01-15',
            amount: 50,
            category: 'InvalidCategory',
            description: 'Test'
          });
        }).toThrow('Invalid category: InvalidCategory');
      });

      it('should throw error for negative amount', () => {
        expect(() => {
          createExpense({
            date: '2024-01-15',
            amount: -50,
            category: 'Food',
            description: 'Test'
          });
        }).toThrow('Amount must be positive');
      });
    });

    describe('Edge Cases', () => {
      it('should handle zero amount', () => {
        const expense = createExpense({
          date: '2024-01-15',
          amount: 0,
          category: 'Food',
          description: 'Free meal'
        });

        expect(expense.amount).toBe(0);
      });

      it('should handle very large amounts', () => {
        const expense = createExpense({
          date: '2024-01-15',
          amount: 999999.99,
          category: 'Shopping',
          description: 'Expensive purchase'
        });

        expect(expense.amount).toBe(999999.99);
      });

      it('should handle special characters in description', () => {
        const expense = createExpense({
          date: '2024-01-15',
          amount: 50,
          category: 'Food',
          description: 'Café "Le Croissant" & Bakery 🥐'
        });

        expect(expense.description).toBe('Café "Le Croissant" & Bakery 🥐');
      });

      it('should handle all valid categories', () => {
        VALID_CATEGORIES.forEach(category => {
          const expense = createExpense({
            date: '2024-01-15',
            amount: 50,
            category,
            description: `Test ${category}`
          });

          expect(expense.category).toBe(category);
        });
      });
    });
  });

  describe('updateExpense', () => {
    let expenses;

    beforeEach(() => {
      expenses = [
        {
          id: '1',
          date: '2024-01-15',
          amount: 50,
          category: 'Food',
          description: 'Original'
        },
        {
          id: '2',
          date: '2024-01-16',
          amount: 100,
          category: 'Shopping',
          description: 'Clothes'
        }
      ];
    });

    describe('Happy Path', () => {
      it('should update expense amount', () => {
        const updated = updateExpense(expenses, '1', { amount: 75 });

        expect(updated[0].amount).toBe(75);
        expect(updated[0].description).toBe('Original'); // Other fields unchanged
      });

      it('should update expense description', () => {
        const updated = updateExpense(expenses, '1', { description: 'Updated description' });

        expect(updated[0].description).toBe('Updated description');
        expect(updated[0].amount).toBe(50); // Other fields unchanged
      });

      it('should update expense category', () => {
        const updated = updateExpense(expenses, '1', { category: 'Transportation' });

        expect(updated[0].category).toBe('Transportation');
      });

      it('should update multiple fields at once', () => {
        const updated = updateExpense(expenses, '1', {
          amount: 80,
          description: 'New description',
          category: 'Entertainment'
        });

        expect(updated[0].amount).toBe(80);
        expect(updated[0].description).toBe('New description');
        expect(updated[0].category).toBe('Entertainment');
      });

      it('should not mutate original array', () => {
        const originalLength = expenses.length;
        const originalFirst = { ...expenses[0] };

        updateExpense(expenses, '1', { amount: 100 });

        expect(expenses.length).toBe(originalLength);
        expect(expenses[0]).toEqual(originalFirst);
      });
    });

    describe('Error Handling', () => {
      it('should throw error when expense not found', () => {
        expect(() => {
          updateExpense(expenses, 'non-existent-id', { amount: 100 });
        }).toThrow('Expense with id non-existent-id not found');
      });

      it('should throw error for invalid category', () => {
        expect(() => {
          updateExpense(expenses, '1', { category: 'InvalidCategory' });
        }).toThrow('Invalid category: InvalidCategory');
      });

      it('should throw error for negative amount', () => {
        expect(() => {
          updateExpense(expenses, '1', { amount: -50 });
        }).toThrow('Amount must be positive');
      });
    });

    describe('Edge Cases', () => {
      it('should handle updating to zero amount', () => {
        const updated = updateExpense(expenses, '1', { amount: 0 });
        expect(updated[0].amount).toBe(0);
      });

      it('should handle empty updates object', () => {
        const updated = updateExpense(expenses, '1', {});
        expect(updated[0]).toEqual(expenses[0]);
      });

      it('should preserve fields not being updated', () => {
        const updated = updateExpense(expenses, '1', { amount: 60 });

        expect(updated[0].id).toBe('1');
        expect(updated[0].date).toBe('2024-01-15');
        expect(updated[0].category).toBe('Food');
        expect(updated[0].description).toBe('Original');
      });

      it('should update correct expense in multi-expense array', () => {
        const updated = updateExpense(expenses, '2', { amount: 200 });

        expect(updated[0].amount).toBe(50); // First unchanged
        expect(updated[1].amount).toBe(200); // Second updated
      });
    });
  });

  describe('deleteExpense', () => {
    let expenses;

    beforeEach(() => {
      expenses = [
        { id: '1', date: '2024-01-15', amount: 50, category: 'Food', description: 'Lunch' },
        { id: '2', date: '2024-01-16', amount: 100, category: 'Shopping', description: 'Clothes' },
        { id: '3', date: '2024-01-17', amount: 30, category: 'Transportation', description: 'Taxi' }
      ];
    });

    describe('Happy Path', () => {
      it('should delete expense by ID', () => {
        const updated = deleteExpense(expenses, '2');

        expect(updated).toHaveLength(2);
        expect(updated.find(e => e.id === '2')).toBeUndefined();
      });

      it('should return array without deleted expense', () => {
        const updated = deleteExpense(expenses, '1');

        expect(updated[0].id).toBe('2');
        expect(updated[1].id).toBe('3');
      });

      it('should not mutate original array', () => {
        const originalLength = expenses.length;
        deleteExpense(expenses, '1');

        expect(expenses).toHaveLength(originalLength);
      });

      it('should delete first expense', () => {
        const updated = deleteExpense(expenses, '1');
        expect(updated).toHaveLength(2);
        expect(updated[0].id).toBe('2');
      });

      it('should delete last expense', () => {
        const updated = deleteExpense(expenses, '3');
        expect(updated).toHaveLength(2);
        expect(updated[1].id).toBe('2');
      });
    });

    describe('Error Handling', () => {
      it('should throw error when expense not found', () => {
        expect(() => {
          deleteExpense(expenses, 'non-existent-id');
        }).toThrow('Expense with id non-existent-id not found');
      });

      it('should throw error when deleting from empty array', () => {
        expect(() => {
          deleteExpense([], '1');
        }).toThrow('Expense with id 1 not found');
      });
    });

    describe('Edge Cases', () => {
      it('should handle deleting single expense', () => {
        const singleExpense = [expenses[0]];
        const updated = deleteExpense(singleExpense, '1');

        expect(updated).toHaveLength(0);
        expect(updated).toEqual([]);
      });
    });
  });

  describe('findExpenseById', () => {
    let expenses;

    beforeEach(() => {
      expenses = [
        { id: '1', date: '2024-01-15', amount: 50, category: 'Food', description: 'Lunch' },
        { id: '2', date: '2024-01-16', amount: 100, category: 'Shopping', description: 'Clothes' }
      ];
    });

    describe('Happy Path', () => {
      it('should find expense by ID', () => {
        const found = findExpenseById(expenses, '1');

        expect(found).toBeDefined();
        expect(found.id).toBe('1');
        expect(found.description).toBe('Lunch');
      });

      it('should find correct expense from multiple expenses', () => {
        const found = findExpenseById(expenses, '2');

        expect(found.id).toBe('2');
        expect(found.description).toBe('Clothes');
      });
    });

    describe('Error Handling', () => {
      it('should return null when expense not found', () => {
        const found = findExpenseById(expenses, 'non-existent');

        expect(found).toBeNull();
      });

      it('should return null for empty array', () => {
        const found = findExpenseById([], '1');

        expect(found).toBeNull();
      });
    });
  });

  describe('addExpense', () => {
    describe('Happy Path', () => {
      it('should add expense to empty array', () => {
        const newExpense = { id: '1', amount: 50, category: 'Food', description: 'Lunch' };
        const updated = addExpense([], newExpense);

        expect(updated).toHaveLength(1);
        expect(updated[0]).toEqual(newExpense);
      });

      it('should add expense to existing array', () => {
        const existing = [
          { id: '1', amount: 50, category: 'Food', description: 'Lunch' }
        ];
        const newExpense = { id: '2', amount: 100, category: 'Shopping', description: 'Clothes' };

        const updated = addExpense(existing, newExpense);

        expect(updated).toHaveLength(2);
        expect(updated[1]).toEqual(newExpense);
      });

      it('should not mutate original array', () => {
        const existing = [{ id: '1', amount: 50 }];
        const newExpense = { id: '2', amount: 100 };

        addExpense(existing, newExpense);

        expect(existing).toHaveLength(1);
      });
    });

    describe('Edge Cases', () => {
      it('should handle adding multiple expenses sequentially', () => {
        let expenses = [];

        expenses = addExpense(expenses, { id: '1', amount: 50 });
        expenses = addExpense(expenses, { id: '2', amount: 100 });
        expenses = addExpense(expenses, { id: '3', amount: 150 });

        expect(expenses).toHaveLength(3);
        expect(expenses[2].id).toBe('3');
      });
    });
  });
});
