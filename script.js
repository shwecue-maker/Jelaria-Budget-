// ===== Budget Calculator Logic =====

// Data storage
let incomes = [];
let expenses = [];

// Get DOM elements
const incomeForm = document.querySelector("#income form");
const expenseForm = document.querySelector("#expenses form");
const totalIncomeEl = document.querySelector("#dashboard .dashboard-card:nth-child(1) p");
const totalExpensesEl = document.querySelector("#dashboard .dashboard-card:nth-child(2) p");
const savingsEl = document.querySelector("#dashboard .dashboard-card:nth-child(3) p");
const reportsList = document.querySelector("#reports ul");

// Chart setup
const ctx = document.getElementById("expenseChart").getContext("2d");
let expenseChart = new Chart(ctx, {
  type: "pie",
  data: {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ["#ffb6d5", "#ffd966", "#f7a1c4", "#ffddc1", "#ffc3a0"]
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: "bottom" }
    }
  }
});

// ===== Functions =====

// Update dashboard totals
function updateDashboard() {
  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const savings = totalIncome - totalExpenses;

  totalIncomeEl.textContent = `$${totalIncome.toFixed(2)}`;
  totalExpensesEl.textContent = `$${totalExpenses.toFixed(2)}`;
  savingsEl.textContent = `$${savings.toFixed(2)}`;
}

// Update reports list
function updateReports() {
  reportsList.innerHTML = "";
  expenses.forEach(e => {
    const li = document.createElement("li");
    li.textContent = `${e.category}: $${e.amount.toFixed(2)}`;
    reportsList.appendChild(li);
  });
}

// Update chart
function updateChart() {
  const categories = [...new Set(expenses.map(e => e.category))];
  const categoryTotals = categories.map(cat =>
    expenses.filter(e => e.category === cat)
            .reduce((sum, e) => sum + e.amount, 0)
  );

  expenseChart.data.labels = categories;
  expenseChart.data.datasets[0].data = categoryTotals;
  expenseChart.update();
}

// ===== Event Listeners =====

// Add income
incomeForm.addEventListener("submit", e => {
  e.preventDefault();
  const source = incomeForm.querySelector("input[type='text']").value.trim();
  const amount = parseFloat(incomeForm.querySelector("input[type='number']").value);

  if (source && !isNaN(amount) && amount > 0) {
    incomes.push({ source, amount });
    updateDashboard();
    incomeForm.reset();
  }
});

// Add expense
expenseForm.addEventListener("submit", e => {
  e.preventDefault();
  const category = expenseForm.querySelector("input[type='text']").value.trim();
  const amount = parseFloat(expenseForm.querySelector("input[type='number']").value);

  if (category && !isNaN(amount) && amount > 0) {
    expenses.push({ category, amount });
    updateDashboard();
    updateReports();
    updateChart();
    expenseForm.reset();
  }
});
