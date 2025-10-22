'use client';

import React, { useState, useEffect } from 'react';
import { ExpenseFormData, ExpenseCategory, Expense } from '@/types/expense';
import { useExpenses } from '@/lib/ExpenseContext';

const categories: ExpenseCategory[] = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Other',
];

interface ExpenseFormProps {
  editingExpense?: Expense | null;
  onCancel?: () => void;
}

export default function ExpenseForm({ editingExpense, onCancel }: ExpenseFormProps) {
  const { addExpense, updateExpense } = useExpenses();
  const [formData, setFormData] = useState<ExpenseFormData>({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: 'Food',
    description: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ExpenseFormData, string>>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        date: editingExpense.date,
        amount: editingExpense.amount.toString(),
        category: editingExpense.category,
        description: editingExpense.description,
      });
    }
  }, [editingExpense]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ExpenseFormData, string>> = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (isNaN(parseFloat(formData.amount))) {
      newErrors.amount = 'Amount must be a valid number';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 3) {
      newErrors.description = 'Description must be at least 3 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (editingExpense) {
      updateExpense(editingExpense.id, formData);
      if (onCancel) onCancel();
    } else {
      addExpense(formData);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        category: 'Food',
        description: '',
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }

    setErrors({});
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ExpenseFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {editingExpense ? 'Edit Expense' : 'Add New Expense'}
      </h2>

      {showSuccess && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          Expense added successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`input-field ${errors.date ? 'border-red-500' : ''}`}
          />
          {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Amount ($)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            className={`input-field ${errors.amount ? 'border-red-500' : ''}`}
          />
          {errors.amount && <p className="mt-1 text-sm text-red-500">{errors.amount}</p>}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
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
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter expense description..."
            rows={3}
            className={`input-field resize-none ${errors.description ? 'border-red-500' : ''}`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn-primary flex-1">
            {editingExpense ? 'Update Expense' : 'Add Expense'}
          </button>
          {editingExpense && onCancel && (
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
