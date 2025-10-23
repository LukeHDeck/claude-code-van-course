/**
 * Statistics Module Tests
 * Comprehensive tests for expense statistics and analytics
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculateStats,
  calculateAverageExpense,
  getExpensesByDateRange,
  getCategoryTotal
} from '../src/stats.js';

describe('Statistics Module', () => {
  describe('calculateStats', () => {
    describe('Happy Path', () => {
      it('should calculate total spending correctly', () => {
        const expenses = [
          { id: '1', date: '2024-01-15', amount: 50, category: 'Food', description: 'Lunch' },
          { id: '2', date: '2024-01-16', amount: 100, category: 'Shopping', description: 'Clothes' },
          { id: '3', date: '2024-01-17', amount: 75, category: 'Transportation', description: 'Taxi' }
        ];

        const stats = calculateStats(expenses);

        expect(stats.totalSpending).toBe(225);
      });

      it('should calculate monthly spending for current month', () => {
        const now = new Date('2024-01-20');
        const expenses = [
          { id: '1', date: '2024-01-15', amount: 50, category: 'Food', description: 'Lunch' },
          { id: '2', date: '2024-01-16', amount: 100, category: 'Shopping', description: 'Clothes' },
          { id: '3', date: '2023-12-17', amount: 75, category: 'Transportation', description: 'Taxi' }
        ];

        const stats = calculateStats(expenses, now);

        expect(stats.monthlySpending).toBe(150); // Only Jan 2024 expenses
      });

      it('should count total expenses correctly', () => {
        const expenses = [
          { id: '1', date: '2024-01-15', amount: 50, category: 'Food', description: 'Lunch' },
          { id: '2', date: '2024-01-16', amount: 100, category: 'Shopping', description: 'Clothes' }
        ];

        const stats = calculateStats(expenses);

        expect(stats.expenseCount).toBe(2);
      });

      it('should identify top spending category', () => {
        const expenses = [
          { id: '1', date: '2024-01-15', amount: 50, category: 'Food', description: 'Lunch' },
          { id: '2', date: '2024-01-16', amount: 100, category: 'Shopping', description: 'Clothes' },
          { id: '3', date: '2024-01-17', amount: 75, category: 'Shopping', description: 'Shoes' }
        ];

        const stats = calculateStats(expenses);

        expect(stats.topCategory).toBe('Shopping');
      });

      it('should calculate category breakdown correctly', () => {
        const expenses = [
          { id: '1', date: '2024-01-15', amount: 50, category: 'Food', description: 'Lunch' },
          { id: '2', date: '2024-01-16', amount: 100, category: 'Shopping', description: 'Clothes' },
          { id: '3', date: '2024-01-17', amount: 30, category: 'Food', description: 'Dinner' },
          { id: '4', date: '2024-01-18', amount: 25, category: 'Transportation', description: 'Uber' }
        ];

        const stats = calculateStats(expenses);

        expect(stats.categoryBreakdown.Food).toBe(80);
        expect(stats.categoryBreakdown.Shopping).toBe(100);
        expect(stats.categoryBreakdown.Transportation).toBe(25);
        expect(stats.categoryBreakdown.Entertainment).toBe(0);
      });

      it('should include all category keys in breakdown', () => {
        const expenses = [
          { id: '1', date: '2024-01-15', amount: 50, category: 'Food', description: 'Lunch' }
        ];

        const stats = calculateStats(expenses);

        expect(stats.categoryBreakdown).toHaveProperty('Food');
        expect(stats.categoryBreakdown).toHaveProperty('Transportation');
        expect(stats.categoryBreakdown).toHaveProperty('Entertainment');
        expect(stats.categoryBreakdown).toHaveProperty('Shopping');
        expect(stats.categoryBreakdown).toHaveProperty('Bills');
        expect(stats.categoryBreakdown).toHaveProperty('Other');
      });
    });

    describe('Edge Cases', () => {
      it('should handle empty expense array', () => {
        const stats = calculateStats([]);

        expect(stats.totalSpending).toBe(0);
        expect(stats.monthlySpending).toBe(0);
        expect(stats.expenseCount).toBe(0);
        expect(stats.topCategory).toBe('Other');
      });

      it('should handle single expense', () => {
        const expenses = [
          { id: '1', date: '2024-01-15', amount: 50, category: 'Food', description: 'Lunch' }
        ];

        const stats = calculateStats(expenses);

        expect(stats.totalSpending).toBe(50);
        expect(stats.topCategory).toBe('Food');
        expect(stats.expenseCount).toBe(1);
      });

      it('should handle expenses from different years', () => {
        const now = new Date('2024-01-20');
        const expenses = [
          { id: '1', date: '2024-01-15', amount: 50, category: 'Food', description: 'Lunch' },
          { id: '2', date: '2023-01-15', amount: 100, category: 'Food', description: 'Old expense' }
        ];

        const stats = calculateStats(expenses, now);

        expect(stats.totalSpending).toBe(150);
        expect(stats.monthlySpending).toBe(50); // Only current year/month
      });

      it('should handle decimal amounts', () => {
        const expenses = [
          { id: '1', date: '2024-01-15', amount: 12.99, category: 'Food', description: 'Coffee' },
          { id: '2', date: '2024-01-16', amount: 25.50, category: 'Food', description: 'Lunch' }
        ];

        const stats = calculateStats(expenses);

        expect(stats.totalSpending).toBeCloseTo(38.49);
      });

      it('should handle zero amount expenses', () => {
        const expenses = [
          { id: '1', date: '2024-01-15', amount: 0, category: 'Food', description: 'Free meal' },
          { id: '2', date: '2024-01-16', amount: 50, category: 'Shopping', description: 'Clothes' }
        ];

        const stats = calculateStats(expenses);

        expect(stats.totalSpending).toBe(50);
        expect(stats.topCategory).toBe('Shopping');
      });

      it('should handle tied categories (picks first in iteration order)', () => {
        const expenses = [
          { id: '1', date: '2024-01-15', amount: 50, category: 'Food', description: 'Lunch' },
          { id: '2', date: '2024-01-16', amount: 50, category: 'Shopping', description: 'Clothes' }
        ];

        const stats = calculateStats(expenses);

        expect(['Food', 'Shopping']).toContain(stats.topCategory);
      });

      it('should handle month boundary correctly', () => {
        const now = new Date('2024-02-01'); // February 1st
        const expenses = [
          { id: '1', date: '2024-01-31', amount: 50, category: 'Food', description: 'Jan expense' },
          { id: '2', date: '2024-02-01', amount: 100, category: 'Shopping', description: 'Feb expense' }
        ];

        const stats = calculateStats(expenses, now);

        expect(stats.monthlySpending).toBe(100); // Only Feb expense
      });

      it('should handle leap year dates', () => {
        const now = new Date('2024-02-29');
        const expenses = [
          { id: '1', date: '2024-02-29', amount: 50, category: 'Food', description: 'Leap day' }
        ];

        const stats = calculateStats(expenses, now);

        expect(stats.monthlySpending).toBe(50);
      });
    });

    describe('Monthly Calculations', () => {
      it('should filter by specific month when reference date provided', () => {
        const referenceDate = new Date('2024-06-15');
        const expenses = [
          { id: '1', date: '2024-06-10', amount: 50, category: 'Food', description: 'June expense' },
          { id: '2', date: '2024-07-10', amount: 100, category: 'Food', description: 'July expense' },
          { id: '3', date: '2024-05-10', amount: 75, category: 'Food', description: 'May expense' }
        ];

        const stats = calculateStats(expenses, referenceDate);

        expect(stats.monthlySpending).toBe(50);
      });

      it('should handle no expenses in current month', () => {
        const now = new Date('2024-03-15');
        const expenses = [
          { id: '1', date: '2024-01-15', amount: 50, category: 'Food', description: 'Old expense' },
          { id: '2', date: '2024-02-15', amount: 100, category: 'Shopping', description: 'Old expense 2' }
        ];

        const stats = calculateStats(expenses, now);

        expect(stats.monthlySpending).toBe(0);
        expect(stats.totalSpending).toBe(150);
      });
    });
  });

  describe('calculateAverageExpense', () => {
    describe('Happy Path', () => {
      it('should calculate average for multiple expenses', () => {
        const expenses = [
          { id: '1', amount: 100 },
          { id: '2', amount: 200 },
          { id: '3', amount: 150 }
        ];

        const average = calculateAverageExpense(expenses);

        expect(average).toBe(150);
      });

      it('should handle single expense', () => {
        const expenses = [{ id: '1', amount: 100 }];

        const average = calculateAverageExpense(expenses);

        expect(average).toBe(100);
      });
    });

    describe('Edge Cases', () => {
      it('should return 0 for empty array', () => {
        const average = calculateAverageExpense([]);

        expect(average).toBe(0);
      });

      it('should handle decimal averages', () => {
        const expenses = [
          { id: '1', amount: 10 },
          { id: '2', amount: 15 },
          { id: '3', amount: 20 }
        ];

        const average = calculateAverageExpense(expenses);

        expect(average).toBeCloseTo(15);
      });

      it('should handle uneven division', () => {
        const expenses = [
          { id: '1', amount: 100 },
          { id: '2', amount: 200 },
          { id: '3', amount: 300 }
        ];

        const average = calculateAverageExpense(expenses);

        expect(average).toBe(200);
      });
    });
  });

  describe('getExpensesByDateRange', () => {
    let expenses;

    beforeEach(() => {
      expenses = [
        { id: '1', date: '2024-01-10', amount: 50, category: 'Food' },
        { id: '2', date: '2024-01-15', amount: 100, category: 'Shopping' },
        { id: '3', date: '2024-01-20', amount: 75, category: 'Transportation' },
        { id: '4', date: '2024-02-05', amount: 60, category: 'Food' }
      ];
    });

    describe('Happy Path', () => {
      it('should return expenses within date range', () => {
        const startDate = new Date('2024-01-12');
        const endDate = new Date('2024-01-18');

        const filtered = getExpensesByDateRange(expenses, startDate, endDate);

        expect(filtered).toHaveLength(1);
        expect(filtered[0].id).toBe('2');
      });

      it('should include expenses on boundary dates', () => {
        const startDate = new Date('2024-01-10');
        const endDate = new Date('2024-01-20');

        const filtered = getExpensesByDateRange(expenses, startDate, endDate);

        expect(filtered).toHaveLength(3);
        expect(filtered.map(e => e.id)).toEqual(['1', '2', '3']);
      });

      it('should return all expenses for wide range', () => {
        const startDate = new Date('2024-01-01');
        const endDate = new Date('2024-12-31');

        const filtered = getExpensesByDateRange(expenses, startDate, endDate);

        expect(filtered).toHaveLength(4);
      });
    });

    describe('Edge Cases', () => {
      it('should return empty array when no expenses in range', () => {
        const startDate = new Date('2024-03-01');
        const endDate = new Date('2024-03-31');

        const filtered = getExpensesByDateRange(expenses, startDate, endDate);

        expect(filtered).toHaveLength(0);
      });

      it('should handle single day range', () => {
        const date = new Date('2024-01-15');

        const filtered = getExpensesByDateRange(expenses, date, date);

        expect(filtered).toHaveLength(1);
        expect(filtered[0].id).toBe('2');
      });

      it('should handle empty expense array', () => {
        const startDate = new Date('2024-01-01');
        const endDate = new Date('2024-12-31');

        const filtered = getExpensesByDateRange([], startDate, endDate);

        expect(filtered).toHaveLength(0);
      });
    });
  });

  describe('getCategoryTotal', () => {
    let expenses;

    beforeEach(() => {
      expenses = [
        { id: '1', date: '2024-01-10', amount: 50, category: 'Food' },
        { id: '2', date: '2024-01-15', amount: 100, category: 'Shopping' },
        { id: '3', date: '2024-01-20', amount: 75, category: 'Food' },
        { id: '4', date: '2024-02-05', amount: 60, category: 'Food' }
      ];
    });

    describe('Happy Path', () => {
      it('should calculate total for specific category', () => {
        const total = getCategoryTotal(expenses, 'Food');

        expect(total).toBe(185); // 50 + 75 + 60
      });

      it('should calculate total for category with single expense', () => {
        const total = getCategoryTotal(expenses, 'Shopping');

        expect(total).toBe(100);
      });

      it('should return 0 for category with no expenses', () => {
        const total = getCategoryTotal(expenses, 'Entertainment');

        expect(total).toBe(0);
      });
    });

    describe('Edge Cases', () => {
      it('should return 0 for empty expense array', () => {
        const total = getCategoryTotal([], 'Food');

        expect(total).toBe(0);
      });

      it('should handle decimal amounts', () => {
        const expensesWithDecimals = [
          { id: '1', amount: 12.99, category: 'Food' },
          { id: '2', amount: 25.50, category: 'Food' }
        ];

        const total = getCategoryTotal(expensesWithDecimals, 'Food');

        expect(total).toBeCloseTo(38.49);
      });
    });
  });
});
