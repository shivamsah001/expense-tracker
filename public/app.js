const form = document.getElementById('expense-form');
const formError = document.getElementById('form-error');

function formatMoney(n) {
  return '₹' + Number(n).toFixed(2);
}

async function loadSummary() {
  const res = await fetch('/api/expenses/summary');
  const data = await res.json();

  document.getElementById('total-month').textContent = formatMoney(data.total);
  document.getElementById('expense-count').textContent = data.count;
  document.getElementById('top-category').textContent =
    data.byCategory.length > 0 ? data.byCategory[0].category : '—';
  document.getElementById('summary-total').textContent = formatMoney(data.total);

  const body = document.getElementById('summary-body');
  body.innerHTML = '';
  for (const row of data.byCategory) {
    body.innerHTML += `<tr><td>${row.category}</td><td>${formatMoney(row.total)}</td></tr>`;
  }
  if (data.byCategory.length === 0) {
    body.innerHTML = '<tr><td colspan="2">No expenses this month.</td></tr>';
  }
}

async function loadExpenses() {
  const res = await fetch('/api/expenses');
  const expenses = await res.json();

  const body = document.getElementById('expense-body');
  body.innerHTML = '';
  for (const e of expenses) {
    body.innerHTML += `
      <tr>
        <td>${e.id}</td>
        <td>${e.description}</td>
        <td>${formatMoney(e.amount)}</td>
        <td>${e.category}</td>
        <td>${new Date(e.date).toLocaleString()}</td>
        <td><button class="delete-btn" data-id="${e.id}">Delete</button></td>
      </tr>`;
  }
  if (expenses.length === 0) {
    body.innerHTML = '<tr><td colspan="6">No expenses yet.</td></tr>';
  }

  document.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      await fetch('/api/expenses/' + btn.dataset.id, { method: 'DELETE' });
      refresh();
    });
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  formError.textContent = '';

  const description = document.getElementById('description').value.trim();
  const amount = document.getElementById('amount').value;
  const category = document.getElementById('category').value;

  if (!description) {
    formError.textContent = 'Description cannot be empty.';
    return;
  }
  if (!amount || Number(amount) <= 0) {
    formError.textContent = 'Amount must be a positive number.';
    return;
  }
  if (!category) {
    formError.textContent = 'Please select a category.';
    return;
  }

  const res = await fetch('/api/expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description, amount: Number(amount), category }),
  });

  const data = await res.json();
  if (!res.ok) {
    formError.textContent = data.error || 'Something went wrong.';
    return;
  }

  form.reset();
  refresh();
});

function refresh() {
  loadExpenses();
  loadSummary();
}

refresh();
