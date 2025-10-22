'use client';

import React, { useState } from 'react';
import { useExpenses } from '@/lib/ExpenseContext';
import { exportToCSV } from '@/utils/helpers';

export default function ExportButton() {
  const { expenses } = useExpenses();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleExport = () => {
    if (expenses.length === 0) {
      alert('No expenses to export');
      return;
    }

    exportToCSV(expenses);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="relative">
      <button
        onClick={handleExport}
        disabled={expenses.length === 0}
        className="btn-secondary flex items-center gap-2"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        Export CSV
      </button>

      {showSuccess && (
        <div className="absolute top-full mt-2 right-0 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg text-sm whitespace-nowrap z-10">
          Exported successfully!
        </div>
      )}
    </div>
  );
}
