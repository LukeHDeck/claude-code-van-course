'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Expense, ExpenseFormData } from '@/types/expense';
import { storage } from '@/utils/storage';
import { generateId } from '@/utils/helpers';

interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (formData: ExpenseFormData) => void;
  updateExpense: (id: string, formData: ExpenseFormData) => void;
  deleteExpense: (id: string) => void;
  isLoading: boolean;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedExpenses = storage.getExpenses();
    setExpenses(loadedExpenses);
    setIsLoading(false);
  }, []);

  const addExpense = (formData: ExpenseFormData) => {
    const newExpense: Expense = {
      id: generateId(),
      date: formData.date,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      createdAt: new Date().toISOString(),
    };

    const updatedExpenses = storage.addExpense(newExpense);
    setExpenses(updatedExpenses);
  };

  const updateExpense = (id: string, formData: ExpenseFormData) => {
    const updatedData: Partial<Expense> = {
      date: formData.date,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
    };

    const updatedExpenses = storage.updateExpense(id, updatedData);
    setExpenses(updatedExpenses);
  };

  const deleteExpense = (id: string) => {
    const updatedExpenses = storage.deleteExpense(id);
    setExpenses(updatedExpenses);
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        isLoading,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};
