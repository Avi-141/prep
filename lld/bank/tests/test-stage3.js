import { BankWithScheduledPayments } from "../bank-stage3.js";

const bank = new BankWithScheduledPayments();

console.log("Testing Bank Stage 3...\n");

// Setup accounts
bank.createAccount("acc1", 0);
bank.createAccount("acc2", 0);
bank.deposit("acc1", 1000);

// Test 1: Basic Transfer
console.log("1. Basic Transfer:");
const transferId = bank.transfer(2000, "acc1", "acc2", 500);
console.log(`Transfer ID: ${transferId}`);
console.log(`acc1 balance: ${bank.getBalance("acc1")} (should be 500)`);
console.log(`acc2 balance: ${bank.getBalance("acc2")} (should be 0)`);

// Test 2: Accept Transfer
console.log("\n2. Accept Transfer:");
console.log(`Debug: Transfer expires at: ${2000 + 86400000}, accepting at: 3000`);
const accepted = bank.acceptTransfer(3000, "acc2", transferId);
console.log(`Accepted: ${accepted} (should be 'true')`);
console.log(`acc1 balance: ${bank.getBalance("acc1")} (should be 500)`);
console.log(`acc2 balance: ${bank.getBalance("acc2")} (should be 500)`);

// Test 3: Schedule Payment
console.log("\n3. Schedule Payment:");
const paymentId = bank.schedulePayment(4000, "acc1", 200, 2000); 
console.log(`Payment ID: ${paymentId} (should be 'payment1')`);
console.log(`acc1 balance: ${bank.getBalance("acc1")} (should still be 500)`);

// Test 4: Execute Scheduled Payment (payment1 executes at 4000+2000=6000)
console.log("\n4. Execute Scheduled Payment:");
bank.schedulePayment(6000, "acc1", 100, 1000); // This triggers payment1 execution (200) + schedules payment3 (100)
console.log(`acc1 balance: ${bank.getBalance("acc1")} (should be 300: 500-200, payment3 not executed yet)`);

// Test 5: Cancel Payment
console.log("\n5. Cancel Payment:");
const paymentId2 = bank.schedulePayment(7000, "acc1", 50, 3000);
const cancelled = bank.cancelPayment(8000, "acc1", paymentId2);
console.log(`Cancelled: ${cancelled} (should be 'true')`);

// Test 6: Edge Cases
console.log("\n6. Edge Cases:");
console.log(`Same account transfer: '${bank.transfer(9000, "acc1", "acc1", 100)}' (should be empty)`);
console.log(`Insufficient funds: '${bank.transfer(9000, "acc1", "acc2", 9999)}' (should be empty)`);
console.log(`Wrong accepter: '${bank.acceptTransfer(9000, "acc1", "transfer999")}' (should be 'false')`);

console.log("\nAll tests completed!");