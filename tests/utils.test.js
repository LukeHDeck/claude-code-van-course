/**
 * Utils Module Tests
 * Comprehensive tests for utility functions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { formatCurrency, formatDate, generateId } from '../src/utils.js';

describe('Utils Module', () => {
  describe('formatCurrency', () => {
    describe('Happy Path', () => {
      it('should format positive integers correctly', () => {
        expect(formatCurrency(100)).toBe('$100.00');
        expect(formatCurrency(1000)).toBe('$1,000.00');
        expect(formatCurrency(1234567)).toBe('$1,234,567.00');
      });

      it('should format decimal amounts correctly', () => {
        expect(formatCurrency(10.5)).toBe('$10.50');
        expect(formatCurrency(99.99)).toBe('$99.99');
        expect(formatCurrency(123.456)).toBe('$123.46'); // Rounds to 2 decimals
      });

      it('should format zero correctly', () => {
        expect(formatCurrency(0)).toBe('$0.00');
      });

      it('should format small amounts correctly', () => {
        expect(formatCurrency(0.01)).toBe('$0.01');
        expect(formatCurrency(0.99)).toBe('$0.99');
      });
    });

    describe('Edge Cases', () => {
      it('should format large numbers correctly', () => {
        expect(formatCurrency(1000000)).toBe('$1,000,000.00');
        expect(formatCurrency(999999999.99)).toBe('$999,999,999.99');
      });

      it('should handle negative amounts', () => {
        expect(formatCurrency(-50)).toBe('-$50.00');
        expect(formatCurrency(-123.45)).toBe('-$123.45');
      });

      it('should handle very small decimals with rounding', () => {
        expect(formatCurrency(0.005)).toBe('$0.01'); // Rounds up
        expect(formatCurrency(0.004)).toBe('$0.00'); // Rounds down
      });
    });

    describe('Error Handling', () => {
      it('should handle NaN gracefully', () => {
        expect(formatCurrency(NaN)).toBe('$NaN');
      });

      it('should handle Infinity', () => {
        expect(formatCurrency(Infinity)).toBe('$∞');
      });
    });
  });

  describe('formatDate', () => {
    describe('Happy Path', () => {
      it('should format ISO date strings correctly', () => {
        expect(formatDate('2024-01-15')).toBe('Jan 15, 2024');
        expect(formatDate('2024-12-31')).toBe('Dec 31, 2024');
      });

      it('should format dates with time correctly', () => {
        expect(formatDate('2024-03-20T10:30:00')).toBe('Mar 20, 2024');
      });

      it('should format dates from different years', () => {
        expect(formatDate('2023-06-15')).toBe('Jun 15, 2023');
        expect(formatDate('2025-11-25')).toBe('Nov 25, 2025');
      });
    });

    describe('Edge Cases', () => {
      it('should handle leap year dates', () => {
        expect(formatDate('2024-02-29')).toBe('Feb 29, 2024');
      });

      it('should handle first day of year', () => {
        expect(formatDate('2024-01-01')).toBe('Jan 1, 2024');
      });

      it('should handle last day of year', () => {
        expect(formatDate('2024-12-31')).toBe('Dec 31, 2024');
      });

      it('should handle Date objects', () => {
        const date = new Date('2024-07-04');
        expect(formatDate(date)).toBe('Jul 4, 2024');
      });
    });

    describe('Error Handling', () => {
      it('should handle invalid date strings', () => {
        const result = formatDate('invalid-date');
        expect(result).toBe('Invalid Date');
      });
    });
  });

  describe('generateId', () => {
    describe('Happy Path', () => {
      it('should generate a string ID', () => {
        const id = generateId();
        expect(typeof id).toBe('string');
      });

      it('should generate IDs with timestamp and random parts', () => {
        const id = generateId();
        expect(id).toMatch(/^\d+-[a-z0-9]+$/);
      });

      it('should include dash separator', () => {
        const id = generateId();
        expect(id).toContain('-');
      });

      it('should have timestamp as first part', () => {
        const id = generateId();
        const timestamp = parseInt(id.split('-')[0]);
        const now = Date.now();
        expect(timestamp).toBeLessThanOrEqual(now);
        expect(timestamp).toBeGreaterThan(now - 1000); // Within last second
      });
    });

    describe('Uniqueness', () => {
      it('should generate unique IDs', () => {
        const ids = new Set();
        for (let i = 0; i < 1000; i++) {
          ids.add(generateId());
        }
        expect(ids.size).toBe(1000); // All IDs should be unique
      });

      it('should generate different IDs on consecutive calls', () => {
        const id1 = generateId();
        const id2 = generateId();
        expect(id1).not.toBe(id2);
      });
    });

    describe('Format Consistency', () => {
      it('should always contain alphanumeric characters and dash', () => {
        for (let i = 0; i < 100; i++) {
          const id = generateId();
          expect(id).toMatch(/^[0-9]+-[a-z0-9]+$/);
        }
      });

      it('should have timestamp part as valid number', () => {
        for (let i = 0; i < 10; i++) {
          const id = generateId();
          const [timestamp] = id.split('-');
          expect(Number.isInteger(parseInt(timestamp))).toBe(true);
        }
      });
    });

    describe('Boundary Testing', () => {
      it('should work correctly with mocked Date.now', () => {
        const mockTime = 1234567890123;
        vi.spyOn(Date, 'now').mockReturnValue(mockTime);

        const id = generateId();
        expect(id.startsWith(`${mockTime}-`)).toBe(true);

        vi.restoreAllMocks();
      });
    });
  });
});
