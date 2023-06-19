"use strict";
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  transactions: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  transactions: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  transactions: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  transactions: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

/////////////////////////////////////////////////
const displayTransactions = function (transactions, sort = false) {
  containerMovements.innerHTML = "";
  const sortTransactions = sort
    ? transactions.slice().sort((a, b) => a - b)
    : transactions;
  sortTransactions.forEach(function (tranc, i) {
    const type = tranc > 0 ? "deposit" : "withdrawal";
    const trancRow = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${tranc.toFixed(2)}₹</div>
    </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", trancRow);
  });
};

// displayTransactions(account1.transactions);

const totalBalance = function (acc) {
  acc.balance = acc.transactions.reduce((bal, tranc) => bal + tranc, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)} INR`;
};
// totalBalance(account1.transactions);

const totalSummaryDisplay = function (acc) {
  const totalDeposit = acc.transactions
    .filter((tranc) => tranc > 0)
    .reduce((dep, tranc) => dep + tranc, 0);
  labelSumIn.textContent = `${totalDeposit.toFixed(2)} ₹`;

  const totalWithdraw = acc.transactions
    .filter((tranc) => tranc < 0)
    .reduce((wit, tranc) => wit + tranc, 0);
  labelSumOut.textContent = `${Math.abs(totalWithdraw).toFixed(2)} ₹`;

  const totalIntrest = acc.transactions
    .filter((tranc) => tranc > 0)
    .map((tranc) => (tranc * acc.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((tot, int) => tot + int, 0);
  labelSumInterest.textContent = `${totalIntrest} ₹`;
};

// totalSummaryDisplay(account1.transactions);

const createusername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((word) => word[0])
      .join("");
  });
};
createusername(accounts);
console.log(accounts);

const updateUI = function (acc) {
  // Display movements
  displayTransactions(acc.transactions);

  // Display balance
  totalBalance(acc);

  // Display summary
  totalSummaryDisplay(acc);
};

let currentAccount;

btnLogin.addEventListener("click", function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const reciever = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  const amount = Number(inputTransferAmount.value);
  inputTransferTo.value = inputTransferAmount.value = "";

  if (
    amount > 0 &&
    reciever &&
    currentAccount.balance > amount &&
    reciever.username !== currentAccount.username
  ) {
    currentAccount.transactions.push(-amount);
    reciever.transactions.push(amount);
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.transactions.some((tranc) => tranc > amount * 0.1)
  ) {
    currentAccount.transactions.push(amount);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  // const user = accounts.find(acc => acc.username === inputCloseUsername.value);
  const user = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);

  if (user === currentAccount.username && pin === currentAccount.pin) {
    const index = accounts.findIndex((acc) => acc.username === user);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
});

let sort = false;

btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayTransactions(currentAccount.transactions, !sort);
  sort = !sort;
});
