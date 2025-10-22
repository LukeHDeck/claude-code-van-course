'use client';

import React, { useState, useMemo } from 'react';
import { Expense, ExpenseCategory } from '@/types/expense';
import { useExpenses } from '@/lib/ExpenseContext';
import { formatCurrency, formatDate, getCategoryColor, getCategoryIcon } from '@/utils/helpers';

interface ExpenseListProps {
  onEdit: (expense: Expense) => void;
}

export default function ExpenseList({ onEdit }: ExpenseListProps) {
  const { expenses, deleteExpense } = useExpenses();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | 'All'>('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesSearch =
        expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = categoryFilter === 'All' || expense.category === categoryFilter;

      const expenseDate = new Date(expense.date);
      const matchesDateFrom = !dateFrom || expenseDate >= new Date(dateFrom);
      const matchesDateTo = !dateTo || expenseDate <= new Date(dateTo);

      return matchesSearch && matchesCategory && matchesDateFrom && matchesDateTo;
    });
  }, [expenses, searchQuery, categoryFilter, dateFrom, dateTo]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('All');
    setDateFrom('');
    setDateTo('');
  };

  const categories: (ExpenseCategory | 'All')[] = [
    'All',
    'Food',
    'Transportation',
    'Entertainment',
    'Shopping',
    'Bills',
    'Other',
  ];

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Expenses</h2>
        <span className="text-sm text-gray-600">
          {filteredExpenses.length} {filteredExpenses.length === 1 ? 'expense' : 'expenses'}
        </span>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as ExpenseCategory | 'All')}
              className="input-field"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        {(searchQuery || categoryFilter !== 'All' || dateFrom || dateTo) && (
          <button onClick={clearFilters} className="text-sm text-primary-600 hover:text-primary-700">
            Clear all filters
          </button>
        )}
      </div>

      <div className="space-y-3">
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No expenses found</p>
            <p className="text-gray-400 text-sm mt-2">
              {expenses.length === 0
                ? 'Add your first expense to get started'
                : 'Try adjusting your filters'}
            </p>
          </div>
        ) : (
          filteredExpenses.map((expense) => (
            <div
              key={expense.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div
                    className={`${getCategoryColor(expense.category)} w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0`}
                  >
                    {getCategoryIcon(expense.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {expense.description}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-600">
                          <span className="font-medium">{expense.category}</span>
                          <span>•</span>
                          <span>{formatDate(expense.date)}</span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-xl font-bold text-gray-900">
                          {formatCurrency(expense.amount)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => onEdit(expense)}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(expense.id)}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
