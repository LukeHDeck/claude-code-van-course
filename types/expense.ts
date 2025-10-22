export type ExpenseCategory =
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Other';

export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  createdAt: string;
}

export interface ExpenseFormData {
  date: string;
  amount: string;
  category: ExpenseCategory;
  description: string;
}

export interface ExpenseFilters {
  category: ExpenseCategory | 'All';
  dateFrom: string;
  dateTo: string;
  searchQuery: string;
}

export interface ExpenseStats {
  totalSpending: number;
  monthlySpending: number;
  categoryBreakdown: Record<ExpenseCategory, number>;
  topCategory: ExpenseCategory;
  expenseCount: number;
}
