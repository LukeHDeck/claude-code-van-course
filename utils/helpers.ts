import { Expense, ExpenseCategory, ExpenseStats } from '@/types/expense';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const calculateStats = (expenses: Expense[]): ExpenseStats => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const totalSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const monthlyExpenses = expenses.filter((exp) => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
  });

  const monthlySpending = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const categoryBreakdown: Record<ExpenseCategory, number> = {
    Food: 0,
    Transportation: 0,
    Entertainment: 0,
    Shopping: 0,
    Bills: 0,
    Other: 0,
  };

  expenses.forEach((exp) => {
    categoryBreakdown[exp.category] += exp.amount;
  });

  let topCategory: ExpenseCategory = 'Other';
  let maxAmount = 0;

  (Object.keys(categoryBreakdown) as ExpenseCategory[]).forEach((category) => {
    if (categoryBreakdown[category] > maxAmount) {
      maxAmount = categoryBreakdown[category];
      topCategory = category;
    }
  });

  return {
    totalSpending,
    monthlySpending,
    categoryBreakdown,
    topCategory,
    expenseCount: expenses.length,
  };
};

export const exportToCSV = (expenses: Expense[]): void => {
  const headers = ['Date', 'Category', 'Description', 'Amount'];
  const rows = expenses.map((exp) => [
    formatDate(exp.date),
    exp.category,
    exp.description,
    exp.amount.toFixed(2),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `expenses-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getCategoryColor = (category: ExpenseCategory): string => {
  const colors: Record<ExpenseCategory, string> = {
    Food: 'bg-orange-500',
    Transportation: 'bg-blue-500',
    Entertainment: 'bg-purple-500',
    Shopping: 'bg-pink-500',
    Bills: 'bg-red-500',
    Other: 'bg-gray-500',
  };
  return colors[category];
};

export const getCategoryIcon = (category: ExpenseCategory): string => {
  const icons: Record<ExpenseCategory, string> = {
    Food: '🍔',
    Transportation: '🚗',
    Entertainment: '🎬',
    Shopping: '🛍️',
    Bills: '📄',
    Other: '📦',
  };
  return icons[category];
};
