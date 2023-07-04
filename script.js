// Get elements
const balanceElement = document.getElementById('balance');
const amountInput = document.getElementById('amount');
const transactionList = document.getElementById('transactions');
const customPrompt = document.getElementById('customPrompt');
const promptCountElement = document.getElementById('promptCount');

let balance = localStorage.getItem('balance') ? parseFloat(localStorage.getItem('balance')) : 0.00;
let transactionHistory = localStorage.getItem('transactions') ? JSON.parse(localStorage.getItem('transactions')) : [];

// Update balance and transaction history display
function updateDisplay() {
  balanceElement.textContent = `Balance: ₹${balance.toFixed(2)}`;

  transactionList.innerHTML = '';
  for (let i = transactionHistory.length - 1; i >= 0; i--) {
    const transaction = transactionHistory[i];
    const listItem = document.createElement('li');
    const type = transaction.type === 'debit' ? 'Take Away' : 'Give Away';
    listItem.textContent = `${type}: ₹${transaction.amount.toFixed(2)} - ${transaction.description}`;
    listItem.classList.add(transaction.type);
    transactionList.appendChild(listItem);
  }
}

// Debit money
function debit() {
  const amount = parseFloat(amountInput.value);
  const description = document.getElementById('description').value;
  if (isNaN(amount) || amount <= 0) {
    alert('Invalid amount!');
    return;
  }

  balance -= amount;
  transactionHistory.push({ type: 'debit', amount, description });
  updateDisplay();
  amountInput.value = '';
  document.getElementById('description').value = '';

  // Save data to localStorage
  localStorage.setItem('balance', balance);
  localStorage.setItem('transactions', JSON.stringify(transactionHistory));
}

// Credit money
function credit() {
  const amount = parseFloat(amountInput.value);
  const description = document.getElementById('description').value;
  if (isNaN(amount) || amount <= 0) {
    alert('Invalid amount!');
    return;
  }

  balance += amount;
  transactionHistory.push({ type: 'credit', amount, description });
  updateDisplay();
  amountInput.value = '';
  document.getElementById('description').value = '';

  // Save data to localStorage
  localStorage.setItem('balance', balance);
  localStorage.setItem('transactions', JSON.stringify(transactionHistory));
}

// Custom Prompt functions
let promptCount = 3;

function showCustomPrompt() {
  customPrompt.style.display = 'flex';
}

function hideCustomPrompt() {
  customPrompt.style.display = 'none';
}

function confirmClearData() {
  promptCount--;
  if (promptCount === 0) {
    localStorage.clear();
    location.reload(); // Refresh the page after clearing data
  } else {
    promptCountElement.textContent = promptCount;
  }
}

// Initialize display
updateDisplay();
