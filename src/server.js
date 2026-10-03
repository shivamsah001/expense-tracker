const express = require('express');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// GET all expenses
app.get('/api/expenses', (req, res) => {
  const expenses = db
    .prepare('SELECT id, description, amount, category, date FROM expenses ORDER BY id DESC')
    .all();
  res.json(expenses);
});

// POST a new expense
app.post('/api/expenses', (req, res) => {
  const { description, amount, category } = req.body;

  if (!description || String(description).trim() === '') {
    return res.status(400).json({ error: 'Description is required.' });
  }
  const parsedAmount = Number(amount);
  if (amount === undefined || amount === null || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ error: 'Amount must be a positive number.' });
  }
  if (!category || String(category).trim() === '') {
    return res.status(400).json({ error: 'Category is required.' });
  }

  const date = new Date().toISOString();
  const result = db
    .prepare('INSERT INTO expenses (description, amount, category, date) VALUES (?, ?, ?, ?)')
    .run(String(description).trim(), parsedAmount, String(category).trim(), date);

  const created = db
    .prepare('SELECT id, description, amount, category, date FROM expenses WHERE id = ?')
    .get(result.lastInsertRowid);
  res.status(201).json(created);
});

// DELETE an expense
app.delete('/api/expenses/:id', (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID.' });
  }
  const result = db.prepare('DELETE FROM expenses WHERE id = ?').run(id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Expense not found.' });
  }
  res.json({ success: true });
});

// GET monthly summary for the current month
app.get('/api/expenses/summary', (req, res) => {
  const now = new Date();
  const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const byCategory = db
    .prepare(
      `SELECT category, SUM(amount) AS total, COUNT(*) AS count
       FROM expenses
       WHERE substr(date, 1, 7) = ?
       GROUP BY category
       ORDER BY total DESC`
    )
    .all(prefix);

  const totalRow = db
    .prepare(
      `SELECT COALESCE(SUM(amount), 0) AS total, COUNT(*) AS count
       FROM expenses WHERE substr(date, 1, 7) = ?`
    )
    .get(prefix);

  res.json({
    month: prefix,
    total: totalRow.total,
    count: totalRow.count,
    byCategory,
  });
});

app.listen(PORT, () => {
  console.log(`Expense Tracker running at http://localhost:${PORT}`);
});
