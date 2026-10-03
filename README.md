# Expense Tracker CLI

A simple command-line expense tracker built with Node.js, SQLite (better-sqlite3), and Commander.

## Installation

```bash
cd expense-tracker
npm install
```

Optionally, link the `expense` command globally:

```bash
npm link
```

## Usage

### Add an expense

```bash
expense add "Lunch" 120 food
```

Arguments:
- `description` — what you spent on
- `amount` — how much you spent (must be a positive number)
- `category` — e.g. food, travel, bills

### List all expenses

```bash
expense list
```

### Monthly summary

```bash
expense summary
```

## Running without `npm link`

Use `node` directly:

```bash
node src/index.js add "Lunch" 120 food
node src/index.js list
node src/index.js summary
```

Or via npm scripts:

```bash
npm run list
npm run summary
```

## Running the Website

```bash
cd expense-tracker
npm install
npm run web
```

Then open your browser at:

```
http://localhost:3000
```

The website serves `public/index.html` and uses the same SQLite database
(`expenses.db`), so all data added via the CLI is visible on the dashboard.
The CLI (`node src/index.js ...`) keeps working alongside the web app.

### REST API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/expenses | List all expenses |
| POST   | /api/expenses | Add an expense (JSON body: description, amount, category) |
| DELETE | /api/expenses/:id | Delete an expense |
| GET    | /api/expenses/summary | Current month totals by category |

## Project Structure

```
expense-tracker/
├── package.json
├── src/
│   ├── index.js
│   ├── server.js
│   ├── database.js
│   └── commands/
│       ├── add.js
│       ├── list.js
│       └── summary.js
├── expenses.db
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
└── README.md
```
