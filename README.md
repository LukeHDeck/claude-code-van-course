# Expense Tracker

A modern, professional expense tracking web application built with vanilla HTML, CSS, and JavaScript. No build tools or frameworks required - just open `index.html` in your browser!

## Features

- **Add Expenses**: Create new expenses with date, amount, category, and description
- **Edit & Delete**: Modify or remove existing expenses
- **Smart Filtering**: Filter expenses by category and search query
- **Dashboard Analytics**: View total spending, monthly spending, and top categories
- **Visual Charts**: Interactive bar charts showing spending by category
- **Export to CSV**: Download your expenses as a CSV file
- **Data Persistence**: All data saved locally using browser localStorage
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Zero Dependencies**: No installation or build process needed

## Categories

- Food 🍔
- Transportation 🚗
- Entertainment 🎬
- Shopping 🛍️
- Bills 📄
- Other 📦

## Tech Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with flexbox and grid
- **JavaScript (ES6+)**: Vanilla JavaScript with localStorage
- **No Framework**: Pure web technologies, no dependencies

## Getting Started

### Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd claude-code-van-course
```

2. Open `index.html` in your web browser:
   - **Option 1**: Double-click the `index.html` file
   - **Option 2**: Right-click and select "Open with" your preferred browser
   - **Option 3**: Use a local web server (optional):
     ```bash
     # Using Python 3
     python -m http.server 8000

     # Using Node.js http-server (if installed)
     npx http-server
     ```

3. Start tracking your expenses!

### No Installation Required

This is a static web application that runs entirely in your browser. No installation, no dependencies, no build process needed!

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

1. Click on the "Dashboard" tab (default view)
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
3. Results update instantly as you type or select

### Editing an Expense

1. Find the expense in the list
2. Click the "Edit" button (✏️)
3. Modify the details in the form
4. Click "Update Expense"

### Deleting an Expense

1. Find the expense in the list
2. Click the "Delete" button (🗑️)
3. Confirm the deletion

### Exporting Data

1. Click the "Export CSV" button in the header
2. Your browser will download a CSV file with all expenses
3. Open the CSV file in Excel, Google Sheets, or any spreadsheet application

## Project Structure

```
claude-code-van-course/
├── index.html          # Complete web application (HTML + CSS + JavaScript)
└── README.md           # This file
```

The entire application is contained in a single `index.html` file for maximum simplicity and portability!

## Features in Detail

### Form Validation

- All fields are required
- Amount must be a positive number
- Date defaults to today
- Real-time form validation

### Responsive Design

- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interface
- Optimized for tablets and phones
- Works on screens from 320px to 4K

### Data Persistence

- Automatic saving to browser localStorage
- Data persists across sessions
- No backend or database required
- Instant updates
- Data stays on your device (privacy-friendly)

### Visual Design

- Clean, modern interface
- Color-coded categories
- Smooth animations and transitions
- Emoji icons for visual clarity
- Professional gradient accents

## Browser Support

This application works in all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

**Minimum Requirements:**
- JavaScript enabled
- localStorage support (available in all modern browsers)

## Data Management

### Where is my data stored?

Your expense data is stored in your browser's localStorage. This means:
- Data stays on your device
- No internet connection required
- Complete privacy (no data sent to servers)
- Data persists until you clear browser data

### Backing up your data

1. Click "Export CSV" to download your expenses
2. Save the CSV file to your computer or cloud storage
3. You can import this data into spreadsheet applications

### Clearing data

To start fresh:
- Clear your browser's localStorage for this site, or
- Open browser developer tools (F12)
- Go to Application → Storage → Local Storage
- Delete the 'expenses' entry

## Customization

### Changing Colors

Open `index.html` and modify the CSS variables or gradient colors in the `<style>` section.

### Adding Categories

1. Find the category arrays in the JavaScript section
2. Add your custom category to `categoryIcons` and `categoryColors`
3. Add the option to the category select elements in the HTML

### Modifying Currency

Change the currency in the `formatCurrency()` function (currently set to USD).

## Development

This application uses:
- Semantic HTML5 elements
- Modern CSS (Flexbox, Grid, Custom Properties)
- ES6+ JavaScript features
- Browser localStorage API
- No external dependencies or frameworks

## Future Enhancements

Potential features for future releases:
- Multi-currency support
- Budget planning and alerts
- Recurring expenses
- Import CSV functionality
- Dark mode toggle
- Data backup to file
- Print-friendly reports
- Advanced analytics
- Custom categories
- Expense attachments
- PWA (Progressive Web App) capabilities

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Why No Framework?

This project intentionally uses vanilla HTML, CSS, and JavaScript to:
- Minimize complexity
- Eliminate build steps
- Reduce dependencies
- Improve performance
- Make the code more accessible to beginners
- Ensure long-term maintainability
- Allow instant deployment (just upload the HTML file)

The entire application is self-contained in one file, making it perfect for learning, customization, and portability!
