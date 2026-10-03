const { Command } = require('commander');
const db = require('../database');

const add = new Command('add')
  .description('Add a new expense')
  .argument('<description>', 'Description of the expense')
  .argument('<amount>', 'Amount spent (must be a positive number)')
  .argument('<category>', 'Category of the expense')
  .action((description, amount, category) => {
    // Validate description
    if (!description || description.trim() === '') {
      console.error('Error: Description cannot be empty.');
      process.exit(1);
    }

    // Validate amount
    const parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      console.error('Error: Amount must be a positive number.');
      process.exit(1);
    }

    // Validate category
    if (!category || category.trim() === '') {
      console.error('Error: Category cannot be empty.');
      process.exit(1);
    }

    const date = new Date().toISOString();

    const stmt = db.prepare(
      'INSERT INTO expenses (description, amount, category, date) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(description.trim(), parsedAmount, category.trim(), date);

    console.log(`Added expense #${result.lastInsertRowid}: ${description} - ₹${parsedAmount.toFixed(2)} (${category})`);
  });

module.exports = add;
