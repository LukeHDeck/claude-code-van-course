# Expense Tracker

A modern, professional expense tracking web application built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Add Expenses**: Create new expenses with date, amount, category, and description
- **Edit & Delete**: Modify or remove existing expenses
- **Smart Filtering**: Filter expenses by date range, category, and search query
- **Dashboard Analytics**: View total spending, monthly spending, and top categories
- **Visual Charts**: Interactive bar charts showing spending by category
- **Export to CSV**: Download your expenses as a CSV file
- **Data Persistence**: All data saved locally using browser localStorage
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Categories

- Food 🍔
- Transportation 🚗
- Entertainment 🎬
- Shopping 🛍️
- Bills 📄
- Other 📦

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Data Storage**: localStorage

## Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd expense-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Usage Guide

### Adding an Expense

1. Navigate to the "Expenses" tab
2. Fill in the expense form:
   - Select the date
   - Enter the amount
   - Choose a category
   - Add a description
3. Click "Add Expense"

### Viewing Dashboard

1. Click on the "Dashboard" tab
2. View your spending statistics:
   - Total spending across all time
   - Current month spending
   - Top spending category
   - Total number of expenses
3. See visual charts of spending by category

### Filtering Expenses

1. Go to the "Expenses" tab
2. Use the filters:
   - Search by description or category
   - Filter by category dropdown
   - Set date range (from/to)
3. Click "Clear all filters" to reset

### Editing an Expense

1. Find the expense in the list
2. Click the "Edit" button
3. Modify the details in the form
4. Click "Update Expense"

### Deleting an Expense

1. Find the expense in the list
2. Click the "Delete" button
3. Confirm the deletion

### Exporting Data

1. Click the "Export CSV" button in the header
2. Your browser will download a CSV file with all expenses

## Project Structure

```
expense-tracker/
├── app/
│   ├── globals.css       # Global styles and Tailwind
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Main page component
├── components/
│   ├── Dashboard.tsx     # Dashboard with stats
│   ├── ExpenseForm.tsx   # Form for adding/editing
│   ├── ExpenseList.tsx   # List with filtering
│   ├── SpendingChart.tsx # Visual chart component
│   └── ExportButton.tsx  # CSV export button
├── lib/
│   └── ExpenseContext.tsx # Context provider
├── types/
│   └── expense.ts        # TypeScript types
├── utils/
│   ├── helpers.ts        # Helper functions
│   └── storage.ts        # localStorage utilities
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Features in Detail

### Form Validation

- Date is required
- Amount must be a positive number
- Description must be at least 3 characters
- Real-time error feedback

### Responsive Design

- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interface
- Optimized for tablets and phones

### Data Persistence

- Automatic saving to localStorage
- Data persists across sessions
- No backend required
- Instant updates

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

The application uses:
- React Server Components where possible
- Client Components for interactivity
- TypeScript for type safety
- Tailwind utility classes for styling
- Context API for global state

## Future Enhancements

Potential features for future releases:
- Multi-currency support
- Budget planning and alerts
- Recurring expenses
- Data backup/restore
- Cloud synchronization
- Multiple user accounts
- Advanced analytics and reports
- Custom categories
- Receipt photo uploads

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
