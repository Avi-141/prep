import { BankWithTopN } from '../bank-stage2.js';

// Test the Stage 2 implementation
const bank = new BankWithTopN();

bank.createAccount('acc1', 100);
bank.createAccount('acc2', 200);
bank.createAccount('acc3', 150);

// Perform transactions
bank.deposit('acc1', 50);  // acc1: 1 transaction
bank.deposit('acc1', 25);  // acc1: 2 transactions

bank.withdraw('acc2', 30); // acc2: 1 transaction
bank.deposit('acc2', 40);  // acc2: 2 transactions
bank.withdraw('acc2', 10); // acc2: 3 transactions

bank.deposit('acc3', 75);  // acc3: 1 transaction

// transfer
bank.transfer('acc1', 'acc3', 25); // acc1: 3 transactions, acc3: 2 transactions

console.log('Transaction counts:');
console.log('acc1:', bank.getTxnCount('acc1')); // Should be 3
console.log('acc2:', bank.getTxnCount('acc2')); // Should be 3
console.log('acc3:', bank.getTxnCount('acc3')); // Should be 2

console.log('\nTop 2 accounts by transaction count:');
console.log(bank.topNByTxnCount(2)); 
// Should show acc1 and acc2 (or acc2 and acc1 if tie-breaking by accountId)

console.log('\nTop 5 accounts by transaction count:');
console.log(bank.topNByTxnCount(5)); // Should show all accounts as only 3