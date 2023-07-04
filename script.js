// Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyDqnZKeeWb_5gI9EJPx1ycT3SRiLKN6H-Y",
  authDomain: "money-cd0d1.firebaseapp.com",
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

// Fetch data from Firebase on page load
database.ref('balance').once('value', function(snapshot) {
  balance = snapshot.val() || 0.00;
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
    alert('Invalid amount!');
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
    alert('Invalid amount!');
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

// Clear data
function clearData() {
  balance = 0.00;
  transactionHistory = [];
  updateDisplay();

  // Save data to Firebase
  database.ref('balance').set(balance);
  database.ref('transactions').set(transactionHistory);
}

// Initialize display
updateDisplay();
