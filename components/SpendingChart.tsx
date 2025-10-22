'use client';

import React, { useMemo } from 'react';
import { useExpenses } from '@/lib/ExpenseContext';
import { formatCurrency, getCategoryColor } from '@/utils/helpers';
import { ExpenseCategory } from '@/types/expense';

export default function SpendingChart() {
  const { expenses } = useExpenses();

  const categoryTotals = useMemo(() => {
    const totals: Record<ExpenseCategory, number> = {
      Food: 0,
      Transportation: 0,
      Entertainment: 0,
      Shopping: 0,
      Bills: 0,
      Other: 0,
    };

    expenses.forEach((expense) => {
      totals[expense.category] += expense.amount;
    });

    return Object.entries(totals)
      .filter(([_, amount]) => amount > 0)
      .sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  const maxAmount = Math.max(...categoryTotals.map(([_, amount]) => amount), 0);
  const total = categoryTotals.reduce((sum, [_, amount]) => sum + amount, 0);

  if (categoryTotals.length === 0) {
    return (
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Spending by Category</h2>
        <div className="text-center py-8 text-gray-500">
          No expenses to display
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Spending by Category</h2>
      <div className="space-y-6">
        {categoryTotals.map(([category, amount]) => {
          const percentage = (amount / maxAmount) * 100;
          const sharePercentage = (amount / total) * 100;

          return (
            <div key={category} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{category}</span>
                <div className="text-right">
                  <span className="font-bold text-gray-900">{formatCurrency(amount)}</span>
                  <span className="text-sm text-gray-600 ml-2">
                    ({sharePercentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="relative w-full h-8 bg-gray-100 rounded-lg overflow-hidden">
                <div
                  className={`${getCategoryColor(category as ExpenseCategory)} h-full rounded-lg transition-all duration-500 flex items-center justify-end pr-3`}
                  style={{ width: `${percentage}%` }}
                >
                  {percentage > 20 && (
                    <span className="text-white text-sm font-medium">
                      {formatCurrency(amount)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-lg">
          <span className="font-bold text-gray-900">Total</span>
          <span className="font-bold text-primary-600">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
