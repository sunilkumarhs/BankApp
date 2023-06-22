"use strict";
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Sunil Kumar",
  transactions: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1718,

  transactionsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2023-06-13T17:01:17.194Z",
    "2023-06-16T23:36:17.929Z",
    "2023-06-20T10:51:36.790Z",
  ],
  currency: "INR",
  locale: "en-IN", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  transactions: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  transactionsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2023-06-14T14:43:26.374Z",
    "2023-06-17T04:49:59.371Z",
    "2023-06-20T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
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

const accounts = [account1, account2];

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
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

const displayDate = (dates, local) => {
  const date = new Date(dates);

  const calDayPassed = (date1, date2) => {
    return Math.abs(date1 - date2) / (1000 * 60 * 60 * 24);
  };
  const dayPassed = Math.trunc(calDayPassed(new Date(), date));
  if (dayPassed === 0) return "Today";
  if (dayPassed === 1) return "Yestarday";
  if (dayPassed <= 7) return `${dayPassed} days ago`;
  return new Intl.DateTimeFormat(local).format(date);
};

const displayTransactions = function (transactions, sort = false) {
  containerMovements.innerHTML = "";
  const sortTransactions = sort
    ? transactions.slice().sort((a, b) => a - b)
    : transactions;
  sortTransactions.forEach(function (tranc, i) {
    const type = tranc > 0 ? "deposit" : "withdrawal";
    const date = displayDate(
      currentAccount.transactionsDates[i],
      currentAccount.locale
    );
    const trancRow = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${date}</div>
      <div class="movements__value">${formatCur(
        tranc.toFixed(2),
        currentAccount.locale,
        currentAccount.currency
      )}</div>
    </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", trancRow);
  });
};

const totalBalance = function (acc) {
  acc.balance = acc.transactions.reduce((bal, tranc) => bal + tranc, 0);
  labelBalance.textContent = `${formatCur(
    acc.balance.toFixed(2),
    currentAccount.locale,
    currentAccount.currency
  )}`;
};

const totalSummaryDisplay = function (acc) {
  const totalDeposit = acc.transactions
    .filter((tranc) => tranc > 0)
    .reduce((dep, tranc) => dep + tranc, 0);
  labelSumIn.textContent = `${formatCur(
    totalDeposit.toFixed(2),
    currentAccount.locale,
    currentAccount.currency
  )}`;

  const totalWithdraw = acc.transactions
    .filter((tranc) => tranc < 0)
    .reduce((wit, tranc) => wit + tranc, 0);
  labelSumOut.textContent = `${formatCur(
    Math.abs(totalWithdraw).toFixed(2),
    currentAccount.locale,
    currentAccount.currency
  )}`;

  const totalIntrest = acc.transactions
    .filter((tranc) => tranc > 0)
    .map((tranc) => (tranc * acc.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((tot, int) => tot + int, 0);
  labelSumInterest.textContent = `${formatCur(
    totalIntrest.toFixed(2),
    currentAccount.locale,
    currentAccount.currency
  )}`;
};

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

let currentAccount, timer;

const startLogOutTimer = function () {
  const ticker = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min} : ${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Login to get started";
      containerApp.style.opacity = 0;
    }
    time--;
  };
  let time = 300;
  ticker();
  timer = setInterval(ticker, 1000);
};

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

    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
      weekday: "long",
    };

    const pDate = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(new Date());

    labelDate.textContent = pDate;

    if (timer) clearInterval(timer);
    startLogOutTimer();
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

    currentAccount.transactionsDates.push(new Date().toISOString());
    reciever.transactionsDates.push(new Date().toISOString());

    if (timer) clearInterval(timer);
    startLogOutTimer();

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
    if (timer) clearInterval(timer);
    startLogOutTimer();
    setTimeout(() => {
      currentAccount.transactions.push(amount);

      currentAccount.transactionsDates.push(new Date().toISOString());

      updateUI(currentAccount);
    }, 5000);
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
