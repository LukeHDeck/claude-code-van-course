# CLAUDE.md - Expense Tracker Project Guide

## Project Overview

**Single-file expense tracking web application** built with vanilla HTML, CSS, and JavaScript. Zero dependencies, no build tools.

**Key Features:**
- 100% client-side (no backend)
- Single HTML file (955 lines total)
- localStorage persistence
- Responsive design
- CSV export

**History:** Converted from Next.js to standalone HTML for simplicity, portability, and zero maintenance overhead.

## Architecture

### File Structure: `index.html`

```
Lines 1-449:   HTML (header, nav, dashboard, expenses form/list)
Lines 7-447:   CSS (embedded styles, responsive design)
Lines 567-953: JavaScript (state, rendering, event handlers)
```

### Data Model

```javascript
// Expense Object
{
  id: string,          // timestamp-random
  date: string,        // YYYY-MM-DD
  amount: number,      // float
  category: string,    // Food|Transportation|Entertainment|Shopping|Bills|Other
  description: string,
  createdAt: string   // ISO timestamp
}

// Storage: localStorage['expenses'] = JSON array
```

### Core Systems

**1. State Management**
- Global array: `let expenses = []`
- Load from localStorage on init
- Save after every mutation
- Re-render affected components

**2. Rendering Functions**
- `renderDashboard()` (lines 685-767) - Stats cards, charts, top categories
- `renderExpenseList()` (lines 793-830) - Filtered expense items
- `renderSpendingChart()` (lines 770-790) - Category bar chart
- All use `innerHTML` replacement pattern

**3. Category System**
```javascript
const categoryIcons = { 'Food': '🍔', 'Transportation': '🚗', ... }
const categoryColors = { 'Food': 'bg-orange', 'Transportation': 'bg-blue', ... }
```

To add category: Update both objects + add `<option>` in 2 dropdowns (lines 510-516, 538-543) + add to `categoryBreakdown` in `calculateStats()` (lines 630-637)

**4. Statistics**
`calculateStats()` (lines 616-660) computes:
- Total spending (all time)
- Monthly spending (current month)
- Category breakdown
- Top category
- Expense count

**5. Filtering**
AND-combined filters (lines 793-830):
- Category dropdown (exact match)
- Search input (substring match on description/category, case-insensitive)
- Results sorted newest first

**6. CSV Export**
`exportToCSV()` (lines 918-948) creates downloadable CSV with format:
```
Date,Category,Description,Amount
"Jan 15, 2025","Food","Groceries","45.50"
```

### CSS Architecture

- **Design:** Tailwind-inspired utilities, system fonts
- **Colors:** `#667eea` (primary), `#10b981` (success), `#f59e0b` (warning)
- **Layout:** CSS Grid + Flexbox
- **Responsive:** Mobile-first, breakpoints at 768px (md) and 1024px (lg)
- **Components:** `.card`, `.stat-card`, `.btn`, `.expense-item`, `.progress-bar`

## Common Development Tasks

### Adding a Field to Expenses

1. Update form submission (line ~860): Add field to expense object
2. Add form input in HTML (after line ~522)
3. Update `renderExpenseList()` (~line 820): Display new field
4. Update `editExpense()` (~line 888): Populate field when editing

### Changing Primary Color

Find/replace `#667eea` and `#764ba2` (gradient) throughout CSS section. Better: Use CSS custom properties.

### Adding Dark Mode

1. Add CSS variables for colors
2. Add `[data-theme="dark"]` selector with dark values
3. Add toggle function: `localStorage.setItem('theme', theme)`
4. Add toggle button in header

### Implementing Charts

Current: CSS-based bars. For advanced charts, add Chart.js via CDN (no build needed).

## Security & Performance

### Security Issues

**XSS Risk:** User input rendered via `innerHTML` without sanitization.

**Fix:**
```javascript
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, m => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  })[m]);
}
```

**Data Validation:** Add try-catch when loading localStorage to handle corruption.

### Performance

- Current: Excellent for <1000 expenses
- Bottleneck: `calculateStats()` called on every render (O(n))
- Fix: Memoization or cache stats until expenses change
- For 1000+ items: Implement virtual scrolling or pagination

## Testing Checklist

- [ ] Add/edit/delete expense
- [ ] Filter by category + search
- [ ] Export CSV
- [ ] Tab switching
- [ ] Mobile viewport (320px)
- [ ] Clear localStorage (empty state)
- [ ] Special characters in description
- [ ] Cancel edit operation

## Browser Compatibility

**Target:** Last 2 versions of modern browsers

**Required Features:**
- localStorage (98% support)
- ES6 (template literals, arrow functions, array methods)
- Intl.NumberFormat/DateTimeFormat

**No IE11 support** (can add polyfills if needed)

## Deployment

**Static Hosting Options:**
1. GitHub Pages - Enable in repo settings
2. Netlify Drop - Drag and drop file
3. Vercel - Connect repo or CLI
4. Direct sharing - Email HTML file (works offline)

No server required. Just upload `index.html`.

## Accessibility Improvements Needed

- Add ARIA labels to icon buttons: `aria-label="Delete expense"`
- Add keyboard handlers: `onkeydown` for Enter key
- Add focus management on tab switching
- Add live region for screen reader announcements: `<div aria-live="polite">`
- All form inputs already have proper `<label>` elements ✅

## Working with Claude/AI

**Guidelines:**
1. Preserve single-file architecture unless asked to split
2. No dependencies - keep vanilla JS
3. Use inline event handlers (`onclick`) for simplicity
4. Test full flow: add → view → edit → delete
5. Consider mobile viewport when changing UI
6. Update both `renderDashboard()` and `renderExpenseList()` if data model changes
7. Validate data before rendering
8. Follow existing patterns (`formatCurrency()`, `formatDate()`)

## Code Patterns

**Good Practices:**
- ✅ Pure formatting functions
- ✅ Single source of truth (localStorage)
- ✅ Consistent naming
- ✅ User confirmations for destructive actions

**Improvements Needed:**
- ⚠️ Input sanitization (XSS risk)
- ⚠️ Data validation
- ⚠️ Error handling
- ⚠️ Stats caching

## Philosophy

**Simplicity:** One file, zero deps, instant usage
**Portability:** Runs anywhere browsers run
**Maintainability:** No build tools to break
**Privacy:** All data stays local

Choose simpler solutions. Complexity is a liability, simplicity is a feature.

---

**Quick Reference:**
- Total lines: 955 (HTML: 1-449, CSS: 7-447, JS: 567-953)
- Storage key: `localStorage['expenses']`
- Categories: Food, Transportation, Entertainment, Shopping, Bills, Other
- Main functions: renderDashboard(), renderExpenseList(), calculateStats(), exportToCSV()
