/**
 * Storage Module Tests
 * Comprehensive tests for localStorage operations
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadExpenses, saveExpenses, clearExpenses } from '../src/storage.js';

describe('Storage Module', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('loadExpenses', () => {
    describe('Happy Path', () => {
      it('should load expenses from localStorage', () => {
        const mockExpenses = [
          { id: '1', date: '2024-01-15', amount: 50, category: 'Food', description: 'Lunch' }
        ];

        localStorage.setItem('expenses', JSON.stringify(mockExpenses));

        const result = loadExpenses();
        expect(result).toEqual(mockExpenses);
      });

      it('should return empty array when no expenses exist', () => {
        const result = loadExpenses();
        expect(result).toEqual([]);
      });

      it('should load multiple expenses', () => {
        const mockExpenses = [
          { id: '1', date: '2024-01-15', amount: 50, category: 'Food', description: 'Lunch' },
          { id: '2', date: '2024-01-16', amount: 100, category: 'Shopping', description: 'Clothes' },
          { id: '3', date: '2024-01-17', amount: 30, category: 'Transportation', description: 'Taxi' }
        ];

        localStorage.setItem('expenses', JSON.stringify(mockExpenses));

        const result = loadExpenses();
        expect(result).toEqual(mockExpenses);
        expect(result).toHaveLength(3);
      });
    });

    describe('Error Handling', () => {
      it('should return empty array on corrupted JSON', () => {
        localStorage.setItem('expenses', 'invalid-json-{]');

        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const result = loadExpenses();

        expect(result).toEqual([]);
        expect(consoleErrorSpy).toHaveBeenCalled();

        consoleErrorSpy.mockRestore();
      });

      it('should handle null values gracefully', () => {
        localStorage.setItem('expenses', 'null');
        const result = loadExpenses();
        expect(result).toEqual([]);
      });

      it('should handle undefined values gracefully', () => {
        localStorage.setItem('expenses', undefined);
        const result = loadExpenses();
        expect(result).toEqual([]);
      });
    });

    describe('Edge Cases', () => {
      it('should handle empty array', () => {
        localStorage.setItem('expenses', JSON.stringify([]));
        const result = loadExpenses();
        expect(result).toEqual([]);
      });

      it('should preserve data types in loaded expenses', () => {
        const mockExpenses = [
          {
            id: '123',
            date: '2024-01-15',
            amount: 99.99,
            category: 'Food',
            description: 'Test expense'
          }
        ];

        localStorage.setItem('expenses', JSON.stringify(mockExpenses));
        const result = loadExpenses();

        expect(typeof result[0].id).toBe('string');
        expect(typeof result[0].amount).toBe('number');
        expect(result[0].amount).toBe(99.99);
      });
    });
  });

  describe('saveExpenses', () => {
    describe('Happy Path', () => {
      it('should save expenses to localStorage', () => {
        const mockExpenses = [
          { id: '1', date: '2024-01-15', amount: 50, category: 'Food', description: 'Lunch' }
        ];

        const result = saveExpenses(mockExpenses);

        expect(result).toBe(true);
        const stored = JSON.parse(localStorage.getItem('expenses'));
        expect(stored).toEqual(mockExpenses);
      });

      it('should save empty array', () => {
        const result = saveExpenses([]);

        expect(result).toBe(true);
        const stored = JSON.parse(localStorage.getItem('expenses'));
        expect(stored).toEqual([]);
      });

      it('should save multiple expenses', () => {
        const mockExpenses = [
          { id: '1', date: '2024-01-15', amount: 50, category: 'Food', description: 'Lunch' },
          { id: '2', date: '2024-01-16', amount: 100, category: 'Shopping', description: 'Clothes' }
        ];

        saveExpenses(mockExpenses);

        const stored = JSON.parse(localStorage.getItem('expenses'));
        expect(stored).toHaveLength(2);
        expect(stored).toEqual(mockExpenses);
      });

      it('should overwrite existing data', () => {
        const initialExpenses = [
          { id: '1', date: '2024-01-15', amount: 50, category: 'Food', description: 'Lunch' }
        ];
        const newExpenses = [
          { id: '2', date: '2024-01-16', amount: 100, category: 'Shopping', description: 'Clothes' }
        ];

        saveExpenses(initialExpenses);
        saveExpenses(newExpenses);

        const stored = JSON.parse(localStorage.getItem('expenses'));
        expect(stored).toEqual(newExpenses);
        expect(stored).toHaveLength(1);
      });
    });

    describe('Error Handling', () => {
      it('should handle localStorage errors', () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        // Temporarily replace localStorage.setItem to throw an error
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = vi.fn(() => {
          throw new Error('Storage quota exceeded');
        });

        const result = saveExpenses([{ id: '1', amount: 100 }]);

        expect(result).toBe(false);
        expect(consoleErrorSpy).toHaveBeenCalled();

        // Restore
        localStorage.setItem = originalSetItem;
        consoleErrorSpy.mockRestore();
      });
    });

    describe('Edge Cases', () => {
      it('should preserve decimal amounts', () => {
        const mockExpenses = [
          { id: '1', date: '2024-01-15', amount: 123.45, category: 'Food', description: 'Lunch' }
        ];

        saveExpenses(mockExpenses);

        const stored = JSON.parse(localStorage.getItem('expenses'));
        expect(stored[0].amount).toBe(123.45);
      });

      it('should handle expenses with special characters in description', () => {
        const mockExpenses = [
          { id: '1', date: '2024-01-15', amount: 50, category: 'Food', description: 'Café au lait & croissant 🥐' }
        ];

        saveExpenses(mockExpenses);

        const stored = JSON.parse(localStorage.getItem('expenses'));
        expect(stored[0].description).toBe('Café au lait & croissant 🥐');
      });

      it('should handle very large expense arrays', () => {
        const largeExpenses = Array.from({ length: 1000 }, (_, i) => ({
          id: `${i}`,
          date: '2024-01-15',
          amount: i * 10,
          category: 'Food',
          description: `Expense ${i}`
        }));

        const result = saveExpenses(largeExpenses);
        expect(result).toBe(true);

        const stored = JSON.parse(localStorage.getItem('expenses'));
        expect(stored).toHaveLength(1000);
      });
    });
  });

  describe('clearExpenses', () => {
    describe('Happy Path', () => {
      it('should clear expenses from localStorage', () => {
        localStorage.setItem('expenses', JSON.stringify([{ id: '1', amount: 50 }]));

        const result = clearExpenses();

        expect(result).toBe(true);
        expect(localStorage.getItem('expenses')).toBeNull();
      });

      it('should work when no expenses exist', () => {
        const result = clearExpenses();
        expect(result).toBe(true);
        expect(localStorage.getItem('expenses')).toBeNull();
      });

      it('should completely remove the key', () => {
        localStorage.setItem('expenses', JSON.stringify([{ id: '1', amount: 50 }]));
        clearExpenses();

        expect(localStorage.getItem('expenses')).toBeNull();
        expect(localStorage.length).toBe(0);
      });
    });

    describe('Error Handling', () => {
      it('should handle localStorage errors', () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        // Temporarily replace localStorage.removeItem to throw an error
        const originalRemoveItem = localStorage.removeItem;
        localStorage.removeItem = vi.fn(() => {
          throw new Error('Storage error');
        });

        const result = clearExpenses();

        expect(result).toBe(false);
        expect(consoleErrorSpy).toHaveBeenCalled();

        // Restore
        localStorage.removeItem = originalRemoveItem;
        consoleErrorSpy.mockRestore();
      });
    });
  });

  describe('Integration Tests', () => {
    it('should support full save-load-clear cycle', () => {
      const mockExpenses = [
        { id: '1', date: '2024-01-15', amount: 50, category: 'Food', description: 'Lunch' },
        { id: '2', date: '2024-01-16', amount: 100, category: 'Shopping', description: 'Clothes' }
      ];

      // Save
      expect(saveExpenses(mockExpenses)).toBe(true);

      // Load
      let loaded = loadExpenses();
      expect(loaded).toEqual(mockExpenses);

      // Clear
      expect(clearExpenses()).toBe(true);

      // Load again (should be empty)
      loaded = loadExpenses();
      expect(loaded).toEqual([]);
    });

    it('should maintain data integrity through multiple operations', () => {
      const expenses1 = [{ id: '1', amount: 50, category: 'Food' }];
      const expenses2 = [{ id: '2', amount: 100, category: 'Shopping' }];

      saveExpenses(expenses1);
      expect(loadExpenses()).toEqual(expenses1);

      saveExpenses(expenses2);
      expect(loadExpenses()).toEqual(expenses2);

      clearExpenses();
      expect(loadExpenses()).toEqual([]);
    });
  });
});
