'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2023-06-25T17:01:17.194Z',
    '2023-06-24T23:36:17.929Z',
    '2023-06-26T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'EGP',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//////////////////////////////////////////////////////////////////////////////////////////////////

//# the functions to build the app

//////////////////////////////////////////////////////////
//#0- to display the dates:
const displayDates = function(date,local){
  const durationDates = function(date1,date2){
    return Math.round(Math.abs((date2-date1)/(1000*60*60*24)));
  }
  let duration = durationDates(new Date(),date)
  console.log(duration);
  if (duration===0)return 'Today';
  if(duration ===1)return 'Yesterday'
  if(duration <=7)return `${duration} days ago`
  else{
    /*
    let day = `${date.getDate()}`.padStart(2,0);
    let month = `${date.getMonth()+1}`.padStart(2,0);
    let year = date.getFullYear();
    return `${day}/${month}/${year}`*/
    return new Intl.DateTimeFormat(local).format(date)
  }

}
///////////////////////////////////////////////////////
//##1-Formatting values and currency
let formattingMovs = function(movs , local , currency){
  return new Intl.NumberFormat(local , {
    style : "currency",
    currency : currency
  }).format(movs)
}
///////////////////////////////////////////////////////
//#2-to set the movements in the container forEach object:
const displayMovements = function(acc,sort=false){
  let sortedMovs = sort?acc.movements.slice().sort((a,b)=>a-b) :acc.movements
  containerMovements.innerHTML=''
  sortedMovs.forEach(function(mov , i){
    let type = (mov>0)?"deposit":"withdrawal";
    //Dates
    let dat = new Date(acc.movementsDates[i])
    let displaydate = displayDates(dat,acc.locale);

    //value of movements
    let formatted =formattingMovs(mov , acc.locale , acc.currency) ;
    let element = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
          <div class="movements__date">${displaydate}</div>
          <div class="movements__value">${formatted}</div>
    </div>
    `
    containerMovements.insertAdjacentHTML('afterbegin', element)
  })
};
//#######################################################
//#3- to add username property for each Account

const userNames=function(accs){
  accs.forEach(function(acc){
    //'Jonas Schmedtmann'
    acc.username = acc.owner.toLowerCase().split(' ').map(ele=>ele[0]).join('');
  })

}
userNames(accounts);
//#######################################################
//4-calculate the current balance

const calcPrintBalance = function(account){
  account.balance = account.movements.reduce((acc,mov)=>acc+mov,0);
  labelBalance.textContent=formattingMovs(account.balance , account.locale , account.currency);
}

//#######################################################
//#5-calculate the summery

const displaySummery = function(account){
  let deposites = account.movements.filter(mov=>mov>0).reduce((acc,ele)=>acc+ele,0);
  labelSumIn.textContent = formattingMovs(deposites , account.locale , account.currency);
  let withdraws = account.movements.filter(mov=>mov<0).reduce((acc,ele)=>acc+ele,0);
  labelSumOut.textContent = formattingMovs(withdraws , account.locale , account.currency);
  let interest = account.movements.filter(mov=>mov>0).map(ele=>(ele*account.interestRate)/100).filter(ele=>ele>=1).reduce((acc,ele)=>acc+ele,0);
  labelSumInterest.textContent=formattingMovs(interest , account.locale , account.currency);
}
//#######################################################
//6-Update UI:
const updateUI = function(acc){
  //1-Display movements
  displayMovements(acc)
  //2-Display current balance
  calcPrintBalance(acc)
  //3-Display summery
  displaySummery(acc)
}
//////////////////////////////////////////////////////////////////////////////////////////////////
//# Event Handlers

//////////////////////////////////////////////////////////

//#7-LOGIN
let currentAccount,timer;
btnLogin.addEventListener("click" , function(e){
  e.preventDefault();
  //console.log("login");
  currentAccount = accounts.find(acc => inputLoginUsername.value === acc.username);

  if(currentAccount?.pin === Number(inputLoginPin.value)){
    // welcome message
    labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(' ')[0]}`
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    //#12-setting date
    let options={
      year:"numeric",
      month:"2-digit",
      weekday:"long",
      day:"numeric",
    }
    let now = new Date();
    labelDate.textContent=new Intl.DateTimeFormat(currentAccount.locale, options).format(now)
    //navigator.language
    /*
    let year = now.getFullYear();
    let month = `${now.getMonth()}`.padStart(2,0);
    let day = `${now.getDate()}`.padStart(2,0);
    let hour = `${now.getHours()}`.padStart(2,0);
    let min = `${now.getMinutes()}`.padStart(2,0);
    labelDate.textContent=`${year}/${month}/${day} , ${hour}:${min}`*/

    inputLoginPin.blur();
    if(timer)clearInterval(timer)
    timer = startLogoutTimer()
    updateUI(currentAccount)

  }
})

//#######################################################
//#8-Setting timer

const startLogoutTimer = function(){
  // 100 second
  let time = 10;//seconds
  let timer = setInterval(function(){
    let min = String(Math.trunc(time/60)).padStart(2,0);
    let second = String(time%60).padStart(2,0);
    //set the timer
    labelTimer.textContent = `${min}:${second}`
    //decrease and check
    if(time ===0){
      clearInterval(timer);
      containerApp.style.opacity=0;
      labelWelcome.textContent = "Log in to get started"
    }
    time--;

  },1000)
  return timer;
}

//#######################################################
//9-Transfer money:

btnTransfer.addEventListener("click" , function(e){
  e.preventDefault();
  let amount = Number(inputTransferAmount.value);
  let receiveAccount = accounts.find(acc => acc.username === inputTransferTo.value);
  //console.log(currentAccount);
  inputTransferAmount.value=inputTransferTo.value = ''
  //1-check balance&username.
  if(amount >0&&receiveAccount&&
    receiveAccount?.username !== currentAccount.username&&
    amount <= currentAccount.balance
  ){
    setTimeout(function(){
      currentAccount.movements.push(-amount)
      currentAccount.movementsDates.push(new Date().toISOString())
      receiveAccount.movements.push(amount)
      receiveAccount.movementsDates.push(new Date().toISOString())
      updateUI(currentAccount)

    },2000)
    clearInterval(timer);
    timer = startLogoutTimer()
  }
})
//#######################################################
//#10-Request loan
btnLoan.addEventListener("click",function(e){
  e.preventDefault();
  let amount = Math.floor(inputLoanAmount.value);
  if(amount>0 && currentAccount.movements.some(mov => mov>=amount*0.1)){
    setTimeout(function(){
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
    },2000)


  }
  clearInterval(timer);
  timer = startLogoutTimer()
  inputLoanAmount.value='';
})
//#######################################################
//#11-Close account
btnClose.addEventListener("click",function(e){
  e.preventDefault();
  let user = inputCloseUsername.value;
  let confPin = Number(inputClosePin.value);
  //console.log(user , confPin);

  if(user===currentAccount.username   && confPin === currentAccount.pin){
    let index = accounts.findIndex(acc => acc.username === user);
    console.log(index);
    accounts.splice(index,1);
    inputCloseUsername.value = inputClosePin.value='';
    containerApp.style.opacity=0;
    //console.log(accounts);
  }
})

//#######################################################
//#12-sorting
let sorted = false;
btnSort.addEventListener("click",function(e){
  e.preventDefault();
  displayMovements(currentAccount.movements,!sorted);
  sorted = !sorted;
})

//#######################################################
//#13-coloring
labelBalance.addEventListener("click",function(){
    [...document.querySelectorAll(".movements__row")].forEach(function(row,i){
      if(i%2===0)
        row.style.backgroundColor = "#8edb63"

    })
})
//////////////////////////////////////////////////////////////////////////////////////////////////

//                                            the End🙌🙌

//////////////////////////////////////////////////////////////////////////////////////////////////