#!/usr/bin/env node

import { addCommand } from './commands/add.js';
import { listCommand } from './commands/list.js';
import { summaryCommand } from './commands/summary.js';

const args = process.argv.slice(2);
const command = args[0];

const commands = {
  add: addCommand,
  list: listCommand,
  summary: summaryCommand,
  help: showHelp
};

function showHelp() {
  console.log(`
Expense Tracker CLI

Usage:
  expense <command> [options]

Commands:
  add [options]              Add a new expense
    -a, --amount <number>    Amount spent (required)
    -c, --category <name>    Category (required)
    -d, --description <text> Description (required)
    --date <YYYY-MM-DD>      Date (default: today)

  list [options]             List expenses
    -c, --category <name>    Filter by category
    -s, --search <text>      Search in descriptions
    -l, --limit <number>     Limit number of results
    --sort <field>           Sort by: date, amount, category (default: date)

  summary [options]          Show spending summary
    -m, --month <YYYY-MM>    Summary for specific month
    -c, --category <name>    Summary for specific category

  help                       Show this help message

Categories:
  food, transportation, entertainment, shopping, bills, other

Examples:
  expense add -a 25.50 -c food -d "Lunch at cafe"
  expense list -c food --limit 10
  expense summary --month 2025-10
`);
}

async function main() {
  if (!command || command === 'help' || command === '--help' || command === '-h') {
    showHelp();
    process.exit(0);
  }

  if (!commands[command]) {
    console.error(`Error: Unknown command '${command}'`);
    console.error(`Run 'expense help' for usage information.`);
    process.exit(1);
  }

  try {
    await commands[command](args.slice(1));
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();
