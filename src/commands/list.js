const { Command } = require('commander');
const db = require('../database');

const list = new Command('list')
  .description('List all expenses')
  .action(() => {
    const expenses = db
      .prepare('SELECT id, description, amount, category, date FROM expenses ORDER BY id ASC')
      .all();

    if (expenses.length === 0) {
      console.log('No expenses found.');
      return;
    }

    const rows = expenses.map((e) => ({
      ID: String(e.id),
      Description: e.description,
      Amount: e.amount.toFixed(2),
      Category: e.category,
      Date: new Date(e.date).toLocaleString(),
    }));

    const headers = Object.keys(rows[0]);
    const widths = headers.map((h) =>
      Math.max(h.length, ...rows.map((r) => r[h].length))
    );

    const line = (cols) =>
      cols.map((c, i) => c.padEnd(widths[i])).join(' | ');

    console.log(line(headers));
    console.log(widths.map((w) => '-'.repeat(w)).join('-+-'));
    for (const r of rows) {
      console.log(line(headers.map((h) => r[h])));
    }
  });

module.exports = list;
