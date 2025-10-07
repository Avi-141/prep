import { Transfer } from './level3.js';

// Unified test harness for Levels 1–3
function solution(queries) {
  const bank = new Transfer();
  const result = [];

  for (const [cmd, ts, ...args] of queries) {
    let out = '';
    switch (cmd) {
      case 'CREATE_ACCOUNT':
        out = bank.createAccount(ts, args[0]) ? 'true' : 'false';
        break;
      case 'DEPOSIT':
        out = bank.deposit(ts, args[0], args[1]);
        break;
      case 'PAY':
        out = bank.pay(ts, args[0], args[1]);
        break;
      case 'TOP_ACTIVITY':
        out = bank.topKActivity(args[0]);
        break;
      case 'TRANSFER':
        out = bank.transfer(ts, args[0], args[1], args[2]);
        break;
      case 'ACCEPT_TRANSFER':
        out = bank.acceptTransfer(ts, args[0], args[1]);
        break;
    }
    result.push(out);
  }

  return result;
}

// Combined test cases across Levels 1–3
const queries = [
  ['CREATE_ACCOUNT', 1, 'Alice'],
  ['CREATE_ACCOUNT', 2, 'Bob'],
  ['DEPOSIT',        3, 'Alice', 100],
  ['DEPOSIT',        4, 'Bob',   50],
  ['PAY',            5, 'Alice', 20],
  ['TOP_ACTIVITY',   6, 2],
  ['TRANSFER',       7, 'Alice', 'Bob', 30],
  ['ACCEPT_TRANSFER',8, 'Bob',   1],
  ['TOP_ACTIVITY',   9, 2]
];

console.log(solution(queries));