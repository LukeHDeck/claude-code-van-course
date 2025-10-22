'use client';

import React, { useMemo } from 'react';
import { useExpenses } from '@/lib/ExpenseContext';
import { calculateStats, formatCurrency, getCategoryIcon } from '@/utils/helpers';
import { ExpenseCategory } from '@/types/expense';

export default function Dashboard() {
  const { expenses } = useExpenses();

  const stats = useMemo(() => calculateStats(expenses), [expenses]);

  const topCategories = useMemo(() => {
    return (Object.entries(stats.categoryBreakdown) as [ExpenseCategory, number][])
      .filter(([_, amount]) => amount > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  }, [stats.categoryBreakdown]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Track your spending and manage your expenses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spending</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatCurrency(stats.totalSpending)}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center text-2xl">
              💰
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatCurrency(stats.monthlySpending)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-2xl">
              📅
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Top Category</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats.topCategory}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {formatCurrency(stats.categoryBreakdown[stats.topCategory])}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-2xl">
              {getCategoryIcon(stats.topCategory)}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.expenseCount}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-2xl">
              📊
            </div>
          </div>
        </div>
      </div>

      {topCategories.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Spending Categories</h2>
          <div className="space-y-4">
            {topCategories.map(([category, amount]) => {
              const percentage = (amount / stats.totalSpending) * 100;
              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getCategoryIcon(category)}</span>
                      <span className="font-medium text-gray-900">{category}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(amount)}</p>
                      <p className="text-sm text-gray-600">{percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-primary-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
