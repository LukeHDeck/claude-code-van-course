/**
 * Filters Module Tests
 * Comprehensive tests for filtering and searching expenses
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  filterByCategory,
  searchExpenses,
  applyFilters,
  sortByDate,
  sortByAmount,
  getExpensesAboveAmount,
  getExpensesBelowAmount
} from '../src/filters.js';

describe('Filters Module', () => {
  let expenses;

  beforeEach(() => {
    expenses = [
      { id: '1', date: '2024-01-10', amount: 50, category: 'Food', description: 'Lunch at cafe' },
      { id: '2', date: '2024-01-15', amount: 100, category: 'Shopping', description: 'New shoes' },
      { id: '3', date: '2024-01-20', amount: 75, category: 'Food', description: 'Grocery shopping' },
      { id: '4', date: '2024-01-25', amount: 30, category: 'Transportation', description: 'Uber ride' },
      { id: '5', date: '2024-02-05', amount: 120, category: 'Entertainment', description: 'Concert tickets' }
    ];
  });

  describe('filterByCategory', () => {
    describe('Happy Path', () => {
      it('should filter expenses by specific category', () => {
        const filtered = filterByCategory(expenses, 'Food');

        expect(filtered).toHaveLength(2);
        expect(filtered.every(e => e.category === 'Food')).toBe(true);
      });

      it('should return all expenses when category is "All"', () => {
        const filtered = filterByCategory(expenses, 'All');

        expect(filtered).toHaveLength(5);
        expect(filtered).toEqual(expenses);
      });

      it('should filter by Transportation category', () => {
        const filtered = filterByCategory(expenses, 'Transportation');

        expect(filtered).toHaveLength(1);
        expect(filtered[0].category).toBe('Transportation');
      });

      it('should filter by Entertainment category', () => {
        const filtered = filterByCategory(expenses, 'Entertainment');

        expect(filtered).toHaveLength(1);
        expect(filtered[0].description).toBe('Concert tickets');
      });
    });

    describe('Edge Cases', () => {
      it('should return empty array for category with no expenses', () => {
        const filtered = filterByCategory(expenses, 'Bills');

        expect(filtered).toHaveLength(0);
      });

      it('should handle empty expense array', () => {
        const filtered = filterByCategory([], 'Food');

        expect(filtered).toHaveLength(0);
      });

      it('should return all expenses when category is undefined', () => {
        const filtered = filterByCategory(expenses, undefined);

        expect(filtered).toEqual(expenses);
      });

      it('should return all expenses when category is null', () => {
        const filtered = filterByCategory(expenses, null);

        expect(filtered).toEqual(expenses);
      });

      it('should return all expenses when category is empty string', () => {
        const filtered = filterByCategory(expenses, '');

        expect(filtered).toEqual(expenses);
      });
    });
  });

  describe('searchExpenses', () => {
    describe('Happy Path', () => {
      it('should search by description (case insensitive)', () => {
        const results = searchExpenses(expenses, 'lunch');

        expect(results).toHaveLength(1);
        expect(results[0].description).toBe('Lunch at cafe');
      });

      it('should search by category', () => {
        const results = searchExpenses(expenses, 'food');

        expect(results).toHaveLength(2);
        expect(results.every(e => e.category === 'Food')).toBe(true);
      });

      it('should find partial matches in description', () => {
        const results = searchExpenses(expenses, 'shop');

        expect(results).toHaveLength(2); // 'Shopping' category and 'Grocery shopping'
      });

      it('should handle uppercase search query', () => {
        const results = searchExpenses(expenses, 'UBER');

        expect(results).toHaveLength(1);
        expect(results[0].description).toBe('Uber ride');
      });

      it('should handle mixed case search query', () => {
        const results = searchExpenses(expenses, 'CoNcErT');

        expect(results).toHaveLength(1);
        expect(results[0].description).toBe('Concert tickets');
      });
    });

    describe('Edge Cases', () => {
      it('should return all expenses for empty query', () => {
        const results = searchExpenses(expenses, '');

        expect(results).toEqual(expenses);
      });

      it('should return all expenses for whitespace query', () => {
        const results = searchExpenses(expenses, '   ');

        expect(results).toEqual(expenses);
      });

      it('should return empty array when no matches found', () => {
        const results = searchExpenses(expenses, 'nonexistent');

        expect(results).toHaveLength(0);
      });

      it('should handle undefined query', () => {
        const results = searchExpenses(expenses, undefined);

        expect(results).toEqual(expenses);
      });

      it('should handle null query', () => {
        const results = searchExpenses(expenses, null);

        expect(results).toEqual(expenses);
      });

      it('should trim whitespace from query', () => {
        const results = searchExpenses(expenses, '  lunch  ');

        expect(results).toHaveLength(1);
        expect(results[0].description).toBe('Lunch at cafe');
      });

      it('should handle empty expense array', () => {
        const results = searchExpenses([], 'food');

        expect(results).toHaveLength(0);
      });
    });

    describe('Multiple Matches', () => {
      it('should return all matching expenses', () => {
        const results = searchExpenses(expenses, 'shopping');

        expect(results).toHaveLength(2);
      });

      it('should match in both description and category', () => {
        const results = searchExpenses(expenses, 'shop');

        expect(results.length).toBeGreaterThanOrEqual(2);
      });
    });
  });

  describe('applyFilters', () => {
    describe('Happy Path', () => {
      it('should apply category filter only', () => {
        const results = applyFilters(expenses, { category: 'Food' });

        expect(results).toHaveLength(2);
        expect(results.every(e => e.category === 'Food')).toBe(true);
      });

      it('should apply search filter only', () => {
        const results = applyFilters(expenses, { search: 'uber' });

        expect(results).toHaveLength(1);
        expect(results[0].description).toBe('Uber ride');
      });

      it('should apply both category and search filters', () => {
        const results = applyFilters(expenses, { category: 'Food', search: 'lunch' });

        expect(results).toHaveLength(1);
        expect(results[0].description).toBe('Lunch at cafe');
      });

      it('should return all expenses with default filters', () => {
        const results = applyFilters(expenses);

        expect(results).toEqual(expenses);
      });

      it('should return all expenses with empty filter object', () => {
        const results = applyFilters(expenses, {});

        expect(results).toEqual(expenses);
      });
    });

    describe('Edge Cases', () => {
      it('should return empty array when both filters exclude all expenses', () => {
        const results = applyFilters(expenses, { category: 'Food', search: 'concert' });

        expect(results).toHaveLength(0);
      });

      it('should handle category "All" with search', () => {
        const results = applyFilters(expenses, { category: 'All', search: 'shopping' });

        expect(results).toHaveLength(2);
      });

      it('should handle empty expense array', () => {
        const results = applyFilters([], { category: 'Food', search: 'lunch' });

        expect(results).toHaveLength(0);
      });
    });

    describe('Filter Combination', () => {
      it('should apply search within filtered category', () => {
        const results = applyFilters(expenses, { category: 'Food', search: 'grocery' });

        expect(results).toHaveLength(1);
        expect(results[0].description).toBe('Grocery shopping');
      });
    });
  });

  describe('sortByDate', () => {
    describe('Happy Path', () => {
      it('should sort by date descending (newest first) by default', () => {
        const sorted = sortByDate(expenses);

        expect(sorted[0].date).toBe('2024-02-05');
        expect(sorted[4].date).toBe('2024-01-10');
      });

      it('should sort by date ascending when specified', () => {
        const sorted = sortByDate(expenses, 'asc');

        expect(sorted[0].date).toBe('2024-01-10');
        expect(sorted[4].date).toBe('2024-02-05');
      });

      it('should sort by date descending when specified', () => {
        const sorted = sortByDate(expenses, 'desc');

        expect(sorted[0].date).toBe('2024-02-05');
        expect(sorted[4].date).toBe('2024-01-10');
      });
    });

    describe('Edge Cases', () => {
      it('should not mutate original array', () => {
        const original = [...expenses];
        sortByDate(expenses);

        expect(expenses).toEqual(original);
      });

      it('should handle empty array', () => {
        const sorted = sortByDate([]);

        expect(sorted).toHaveLength(0);
      });

      it('should handle single expense', () => {
        const singleExpense = [expenses[0]];
        const sorted = sortByDate(singleExpense);

        expect(sorted).toHaveLength(1);
        expect(sorted[0]).toEqual(expenses[0]);
      });

      it('should handle expenses with same date', () => {
        const sameDate = [
          { id: '1', date: '2024-01-15', amount: 50 },
          { id: '2', date: '2024-01-15', amount: 100 }
        ];

        const sorted = sortByDate(sameDate);

        expect(sorted).toHaveLength(2);
      });
    });
  });

  describe('sortByAmount', () => {
    describe('Happy Path', () => {
      it('should sort by amount descending (highest first) by default', () => {
        const sorted = sortByAmount(expenses);

        expect(sorted[0].amount).toBe(120);
        expect(sorted[4].amount).toBe(30);
      });

      it('should sort by amount ascending when specified', () => {
        const sorted = sortByAmount(expenses, 'asc');

        expect(sorted[0].amount).toBe(30);
        expect(sorted[4].amount).toBe(120);
      });

      it('should sort by amount descending when specified', () => {
        const sorted = sortByAmount(expenses, 'desc');

        expect(sorted[0].amount).toBe(120);
        expect(sorted[4].amount).toBe(30);
      });
    });

    describe('Edge Cases', () => {
      it('should not mutate original array', () => {
        const original = [...expenses];
        sortByAmount(expenses);

        expect(expenses).toEqual(original);
      });

      it('should handle empty array', () => {
        const sorted = sortByAmount([]);

        expect(sorted).toHaveLength(0);
      });

      it('should handle single expense', () => {
        const singleExpense = [expenses[0]];
        const sorted = sortByAmount(singleExpense);

        expect(sorted).toHaveLength(1);
      });

      it('should handle expenses with same amount', () => {
        const sameAmount = [
          { id: '1', amount: 50, description: 'First' },
          { id: '2', amount: 50, description: 'Second' }
        ];

        const sorted = sortByAmount(sameAmount);

        expect(sorted).toHaveLength(2);
        expect(sorted.every(e => e.amount === 50)).toBe(true);
      });

      it('should handle decimal amounts', () => {
        const decimalExpenses = [
          { id: '1', amount: 12.99 },
          { id: '2', amount: 25.50 },
          { id: '3', amount: 10.00 }
        ];

        const sorted = sortByAmount(decimalExpenses, 'asc');

        expect(sorted[0].amount).toBe(10.00);
        expect(sorted[2].amount).toBe(25.50);
      });
    });
  });

  describe('getExpensesAboveAmount', () => {
    describe('Happy Path', () => {
      it('should return expenses above threshold', () => {
        const results = getExpensesAboveAmount(expenses, 75);

        expect(results).toHaveLength(3);
        expect(results.every(e => e.amount >= 75)).toBe(true);
      });

      it('should include expenses equal to threshold', () => {
        const results = getExpensesAboveAmount(expenses, 75);

        expect(results.some(e => e.amount === 75)).toBe(true);
      });

      it('should return all expenses for threshold of 0', () => {
        const results = getExpensesAboveAmount(expenses, 0);

        expect(results).toHaveLength(5);
      });
    });

    describe('Edge Cases', () => {
      it('should return empty array when all expenses below threshold', () => {
        const results = getExpensesAboveAmount(expenses, 200);

        expect(results).toHaveLength(0);
      });

      it('should handle empty expense array', () => {
        const results = getExpensesAboveAmount([], 50);

        expect(results).toHaveLength(0);
      });

      it('should handle negative threshold', () => {
        const results = getExpensesAboveAmount(expenses, -10);

        expect(results).toHaveLength(5);
      });

      it('should handle decimal threshold', () => {
        const results = getExpensesAboveAmount(expenses, 75.5);

        expect(results).toHaveLength(2);
        expect(results.every(e => e.amount >= 75.5)).toBe(true);
      });
    });
  });

  describe('getExpensesBelowAmount', () => {
    describe('Happy Path', () => {
      it('should return expenses below threshold', () => {
        const results = getExpensesBelowAmount(expenses, 75);

        expect(results).toHaveLength(3);
        expect(results.every(e => e.amount <= 75)).toBe(true);
      });

      it('should include expenses equal to threshold', () => {
        const results = getExpensesBelowAmount(expenses, 75);

        expect(results.some(e => e.amount === 75)).toBe(true);
      });

      it('should return no expenses for threshold of 0', () => {
        const results = getExpensesBelowAmount(expenses, 0);

        expect(results).toHaveLength(0);
      });
    });

    describe('Edge Cases', () => {
      it('should return all expenses when threshold is very high', () => {
        const results = getExpensesBelowAmount(expenses, 1000);

        expect(results).toHaveLength(5);
      });

      it('should handle empty expense array', () => {
        const results = getExpensesBelowAmount([], 50);

        expect(results).toHaveLength(0);
      });

      it('should handle decimal threshold', () => {
        const results = getExpensesBelowAmount(expenses, 50.5);

        expect(results).toHaveLength(2);
        expect(results.every(e => e.amount <= 50.5)).toBe(true);
      });
    });
  });

  describe('Integration Tests', () => {
    it('should support chaining filter and sort operations', () => {
      const filtered = filterByCategory(expenses, 'Food');
      const sorted = sortByAmount(filtered, 'asc');

      expect(sorted).toHaveLength(2);
      expect(sorted[0].amount).toBe(50);
      expect(sorted[1].amount).toBe(75);
    });

    it('should support complex filtering scenarios', () => {
      let results = filterByCategory(expenses, 'Food');
      results = searchExpenses(results, 'lunch');
      results = sortByDate(results, 'desc');

      expect(results).toHaveLength(1);
      expect(results[0].description).toBe('Lunch at cafe');
    });

    it('should combine amount filtering with category filtering', () => {
      const categoryFiltered = filterByCategory(expenses, 'Food');
      const amountFiltered = getExpensesAboveAmount(categoryFiltered, 60);

      expect(amountFiltered).toHaveLength(1);
      expect(amountFiltered[0].amount).toBe(75);
    });
  });
});
