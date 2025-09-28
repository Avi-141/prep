import { BankWithTopN } from '../bank-stage2.js';

// Test edge cases
const bank = new BankWithTopN();

// Test with no accounts
console.log('Top N with no accounts:');
console.log('Top 3:', bank.topNByTxnCount(3)); // Should return empty array

// Test getTxnCount for non-existent account
console.log('\nTxn count for non-existent account:');
console.log('Non-existent account:', bank.getTxnCount('shitherewegoagain')); // Should return 0

// Create accounts and test failed transactions (should not increment count)
bank.createAccount('test1', 100);
bank.createAccount('test2', 50);

console.log('\nBefore any transactions:');
console.log('test1 count:', bank.getTxnCount('test1'));
console.log('test2 count:', bank.getTxnCount('test2'));

// Failed transactions
console.log('\nTesting failed transactions:');
console.log('Withdraw more than balance:', bank.withdraw('test1', 200)); // Should fail
console.log('Deposit to non-existent account:', bank.deposit('fake', 50)); // Should fail
console.log('Transfer more than balance:', bank.transfer('test2', 'test1', 100)); // Should fail

console.log('\nCounts after failed transactions (should still be 0):');
console.log('test1 count:', bank.getTxnCount('test1'));
console.log('test2 count:', bank.getTxnCount('test2'));

// Successful transactions
console.log('\nSuccessful transactions:');
console.log('Deposit to test1:', bank.deposit('test1', 50)); // Should succeed
console.log('Transfer from test1 to test2:', bank.transfer('test1', 'test2', 25)); // Should succeed

console.log('\nCounts after successful transactions:');
console.log('test1 count:', bank.getTxnCount('test1'));
console.log('test2 count:', bank.getTxnCount('test2'));

console.log('\nTop N results:');
console.log('Top 5:', bank.topNByTxnCount(5));