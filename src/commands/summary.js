const { Command } = require('commander');
const db = require('../database');

const summary = new Command('summary')
  .description('Show total spending in the current month grouped by category')
  .action(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const prefix = `${year}-${month}`;

    const rows = db
      .prepare(
        `SELECT category, SUM(amount) AS total
         FROM expenses
         WHERE substr(date, 1, 7) = ?
         GROUP BY category
         ORDER BY total DESC`
      )
      .all(prefix);

    if (rows.length === 0) {
      console.log(`No expenses found for ${prefix}.`);
      return;
    }

    console.log(`Expense summary for ${prefix}:`);
    console.log('Category     | Total');
    console.log('-------------+----------');

    let grandTotal = 0;
    for (const row of rows) {
      console.log(`${row.category.padEnd(12)} | ${row.total.toFixed(2)}`);
      grandTotal += row.total;
    }
    console.log('-------------+----------');
    console.log(`${'TOTAL'.padEnd(12)} | ${grandTotal.toFixed(2)}`);
  });

module.exports = summary;
