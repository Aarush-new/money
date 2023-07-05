// Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyDqnZKeeWb_5gI9EJPx1ycT3SRiLKN6H-Y",
  authDomain: "money-cd0d1.firebaseapp.com",
  databaseURL: "https://money-cd0d1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "money-cd0d1",
  storageBucket: "money-cd0d1.appspot.com",
  messagingSenderId: "19888883860",
  appId: "1:19888883860:web:b2e14c1068acf60ddb8c81",
  measurementId: "G-B12S2KWYQG"
};

firebase.initializeApp(firebaseConfig);

// Get a reference to the Firebase Realtime Database
var database = firebase.database();

// Get elements
const balanceElement = document.getElementById('balance');
const amountInput = document.getElementById('amount');
const transactionList = document.getElementById('transactions');

let balance = 0.00; // Initialize balance
let transactionHistory = []; // Initialize transaction history
let promptCount = 3; // Number of prompts

// Fetch data from Firebase on page load
database.ref('balance').once('value', function(snapshot) {
  balance = parseFloat(snapshot.val()) || 0.00;
  updateDisplay();
});

database.ref('transactions').once('value', function(snapshot) {
  transactionHistory = snapshot.val() || [];
  updateDisplay();
});

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
    showCustomPrompt('Invalid amount!');
    return;
  }

  balance -= amount;
  transactionHistory.push({ type: 'debit', amount, description });
  updateDisplay();
  amountInput.value = '';
  document.getElementById('description').value = '';

  // Save data to Firebase
  database.ref('balance').set(balance);
  database.ref('transactions').set(transactionHistory);
}

// Credit money
function credit() {
  const amount = parseFloat(amountInput.value);
  const description = document.getElementById('description').value;
  if (isNaN(amount) || amount <= 0) {
    showCustomPrompt('Invalid amount!');
    return;
  }

  balance += amount;
  transactionHistory.push({ type: 'credit', amount, description });
  updateDisplay();
  amountInput.value = '';
  document.getElementById('description').value = '';

  // Save data to Firebase
  database.ref('balance').set(balance);
  database.ref('transactions').set(transactionHistory);
}

function showCustomPrompt(message) {
  const promptContent = document.getElementById('promptContent');

  promptContent.innerHTML = `
    <p>${message}</p>
    <button onclick="hidePrompt()" class="button-green">OK</button>
  `;

  const customPrompt = document.getElementById('customPrompt');
  customPrompt.style.display = 'flex';
}

// Clear data
function clearData() {
  if (promptCount === 3) {
    showPrompt();
  } else if (promptCount > 0) {
    confirmClearData();
  }
}

// Show prompt
function showPrompt() {
  document.getElementById('customPrompt').style.display = 'flex';
  document.getElementById('promptContent').innerHTML = `
    <p>Are you sure? <span id="promptCount">${promptCount}</span></p>
    <button onclick="confirmClearData()" class="button-red">Yes</button>
    <button onclick="cancelPrompt()" class="button-green">Cancel</button>
  `;
}

// Confirm clear data
function confirmClearData() {
  promptCount--;
  if (promptCount > 0) {
    document.getElementById('promptCount').textContent = promptCount;
  } else {
    balance = 0.00;
    transactionHistory = [];
    updateDisplay();

    // Save data to Firebase
    database.ref('balance').set(balance);
    database.ref('transactions').set(transactionHistory);

    hidePrompt();
  }
}

// Cancel prompt
function cancelPrompt() {
  resetPromptCount();
  hidePrompt();
}

// Hide prompt
function hidePrompt() {
  resetPromptCount();
  document.getElementById('customPrompt').style.display = 'none';
}

// Reset prompt count
function resetPromptCount() {
  promptCount = 3;
}

// Initialize display
updateDisplay();
