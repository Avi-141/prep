/*
Level 3
The banking system should allow scheduling payments and checking the status of scheduled payments.
1, TRANSFER <timestamp> <sourceAccountId> ‹targetAccountId> <amount> - should initiate a transfer between accounts.
The given amount of money should be withdrawn from the source account sourceAccountId and held until the transfer is accepted by the target account targetAccountId, or until the transfer expires. 
The withheld money is added back to the source account's balance if the transfer expires. After the query is processed:
• Returns an empty string if sourceAccountId is equal to targetAccountId.
• Returns an empty string if sourceAccountId or targetAccountId doesn't exist.
• Returns an empty string if the source account sourceAccountId has insufficient funds to perform the transfer.
• The expiration period is 24 hours, which is equal to 24 • 60 • 60 • 1000 = 86400000 milliseconds.
A transfer expires at the beginning of the next millisecond after the expiration period ends.
• A valid TransFer should return a string containing a unique transfer ID in the following format
"transfer[ordinal number of the transfer]", e.g., "transfer1","transfer2", etc.
• For transfers, transaction history for source and target accounts is only updated when the transfer is accepted.
• Transfers count toward the total value of transactions of both source and target accounts.

2, ACCEPT_TRANSFER ‹timestamp> <accountId> <transferId> - Should accept the transfer with the given transferId.
• Returns "true" if the transfer was successfully accepted or "false" otherwise.
• Returns "false" if a transfer with transferId does not exist, was already accepted, or has expired.
• Returns "false" if the given accountId was not the target account for the transfer.

Level 3  (Variant Java)
The system should allow scheduling payments and checking the status of scheduled payments.
• Optional<String> schedulePayment(int timestamp, String accountId, int amount, int delay) - 
    should schedule a payment which will be performed at timestamp + delay . 
Returns a string with a unique identifier for the scheduled payment in the following format: 
"payment [ordinal number of the scheduled payment across all accounts] - e.g., "payment1", "payment2", etc. 
If accountId doesn't exist, should return Optional.empty. 
The payment is skipped if the specified account has insufficient funds when the payment is performed. 
Additional conditions:
• Successful payments should be considered outgoing transactions and included when ranking accounts using the
 operation.
• Scheduled payments should be processed before any other transactions at the given timestamp.
• If an account needs to perform several scheduled payments simultaneously, they should be processed in order of
 creation - e.g., "payment1" should be processed before "payment2"
• boolean cancelPayment(int timestamp, String accountId, String paymentId) - should cancel the scheduled payment
with paymentId. Returns true if the scheduled payment is successfully canceled. If paymentId does not exist or
was already canceled, or if accountId is different from the source account for the scheduled payment, returns false.
 Note that scheduled payments must be performed before any cancelPayment operations at the given timestamp.

Level 3 (Variant-Python)
pay (self, timestamp: int, account_id: str, amount: int) -> str | None
- Should withdraw the given amount of money from the specified account. 
All withdraw transactions provide a 2% cashback
 - 2% of the withdrawn amount (rounded down to the nearest integer) will be refunded to the account 24 hours after
  the withdrawal. If the withdrawal is successful (i.e., the account holds sufficient funds to withdraw
   the given amount), returns a string with a unique identifier for the payment transaction in this format:
    "payment(ordinal number of withdraws from all accounts]" -e.g., "payment1", "payment2", etc.
Additional conditions:
• Returns None if account_id doesn't exist.
• Returns None if account_id has insufficient funds to perform the payment.
• top_spenders should now also account for the total amount of money withdrawn from accounts.
• The waiting period for cashback is 24 hours, equal to 24 * 60 * 60 * 1000 = 86400000 milliseconds
  (the unit for timestamps). So, cashback will be processed at timestamp, timestamp + 86400000 .
• When it's time to process cashback for a withdrawal, the amount must be refunded to the account before any other
  transactions are performed at the relevant timestamp.

get_payment_status (self, timestamp: int, account_id: str, payment: str) -> str | None -
Should return the status of the payment transaction for the given payment.
Specifically:
• Returns None if account_id doesn't exist.
• Returns None if the given payment doesn't exist for the specified account.
• Returns None if the payment transaction was for an account with a different identifier from account_id
• Returns a string representing the payment status: "IN_PROGRESS" or "CASHBACK_RECEIVED".

The system should allow scheduling payments and checking the status of scheduled payments.
• SCHEDULE_PAYMENT < timestamp> < accountId> ‹amount > ‹delay> - should schedule a payment which will be performed
at timestamp + delay. Returns a string with a unique identifier for the scheduled payment in the following format:
"payment [ordinal number of the scheduled payment across all accounts]" - e.g.,
"payment1", "payment2", etc. If account id doesn't exist, should return an empty string. The payment is skipped if the
specified account has insufficient funds when the payment is performed.
Additional conditions:
• Successful payments should be considered outgoing transactions and included when ranking accounts using the
TOP_SPENDERS operation.
• Scheduled payments should be processed before any other transactions at the given timestamp.
• If an account needs to perform several scheduled payments simultaneously, they should be processed in order
 of creation - e.g., "payment1" should be processed before "payment2"

CANCEL_PAYMENT < timestamp> <accountId> <paymentId> - should cancel the scheduled payment with paymentId.
Returns "true" if the scheduled payment is successfully canceled. If payment id does not exist or was already canceled,
 or if account id is different from the source account for the scheduled payment, returns
"false" . Note that scheduled payments must be performed before any CANCEL_PAYMENT operations at the given timestamp.
*/

import { BankWithTopN } from "./bank-stage2.js";

export class BankWithScheduledPayments extends BankWithTopN {
  constructor() {
    super();
    this.scheduledPayments = new Map(); // Map of paymentId to payment details
    this.paymentCounter = 0; // Counter to generate unique payment IDs for every payment
    this.transfers = new Map(); // Map of transferId to transfer details
    this.transferCounter = 0; // Counter to generate unique transfer IDs for every transfer
    this.expiryLimit = 86400000; // 24 hours in milliseconds
  }


  processScheduledPayments(timestamp) {
    // Process payments in insertion order (Map preserves insertion order)
    for (const [paymentId, paymentDetails] of this.scheduledPayments) {
      if (!paymentDetails.isCancelled && paymentDetails.executeAt <= timestamp) {
        if (super.withdraw(paymentDetails.accountId, paymentDetails.amount)) {
          // Payment successful, remove from scheduled payments
          this.scheduledPayments.delete(paymentId);
        }
      }
    }
  }

  schedulePayment(timestamp, accountId, amount, delay) {
    this.processScheduledPayments(timestamp); // process any scheduled payments due at this timestamp
    if (!this.accounts.has(accountId)) return ""
    // Don't check balance here - payment is skipped if insufficient funds when executed
    this.paymentCounter += 1
    const paymentId = `payment${this.paymentCounter}`
    const executeAt = timestamp + delay
    this.scheduledPayments.set(paymentId, { accountId, amount, executeAt, isCancelled: false })
    return paymentId
  }

  cancelPayment(timestamp, accountId, paymentId) {
    this.processScheduledPayments(timestamp); // process scheduled payments first

    if (!this.scheduledPayments.has(paymentId)) return "false";

    const payment = this.scheduledPayments.get(paymentId);

    if (payment.isCancelled) return "false";
    if (payment.accountId !== accountId) return "false";

    // Cancel the payment
    payment.isCancelled = true;
    return "true";
  }

  transfer(timestamp, sourceAccountId, targetAccountId, amount) {
    this.processScheduledPayments(timestamp);
    this.cleanupExpiredTransfers(timestamp); // Clean up expired transfers before creating new one
    // Return empty string if source and target are the same
    if (sourceAccountId === targetAccountId) return "";
    if (!this.accounts.has(sourceAccountId) || !this.accounts.has(targetAccountId)) return "";
    if (super.getBalance(sourceAccountId) < amount) return "";
    // Withdraw money from source account (hold it)
    this.accounts.get(sourceAccountId).balance -= amount;
    // Create transfer
    this.transferCounter += 1;
    const transferId = `transfer${this.transferCounter}`;
    const expiresAt = timestamp + this.expiryLimit;

    this.transfers.set(transferId, {
      sourceAccountId,
      targetAccountId,
      amount,
      expiresAt,
      isAccepted: false,
      timestamp
    });

    return transferId;
  }

  acceptTransfer(timestamp, accountId, transferId) {
    this.processScheduledPayments(timestamp);
    this.cleanupExpiredTransfers(timestamp); // Clean up expired transfers before processing acceptance
    // Check if transfer exists
    if (!this.transfers.has(transferId)) return "false";
    const transfer = this.transfers.get(transferId);

    if (transfer.isAccepted) return "false";

    // Check if expired (expires at the beginning of next millisecond after expiration period)
    if (timestamp > transfer.expiresAt) {
      // Transfer expired, return money to source account
      this.accounts.get(transfer.sourceAccountId).balance += transfer.amount;
      this.transfers.delete(transferId);
      return "false";
    }

    // Check if accountId is the target account
    if (accountId !== transfer.targetAccountId) return "false";

    // Accept the transfer
    transfer.isAccepted = true;
    // Add money to target account
    this.accounts.get(transfer.targetAccountId).balance += transfer.amount;

    // Update transaction history for both accounts (only when accepted)
    const sourceAccount = this.accounts.get(transfer.sourceAccountId);
    const targetAccount = this.accounts.get(transfer.targetAccountId);

    sourceAccount.totalTransactions += transfer.amount;
    targetAccount.totalTransactions += transfer.amount;

    // Remove transfer from active transfers
    this.transfers.delete(transferId);
    return "true";
  }

  // Clean up expired transfers and return money to source accounts
  cleanupExpiredTransfers(timestamp) {
    for (const [transferId, transfer] of this.transfers) {
      if (!transfer.isAccepted && timestamp > transfer.expiresAt) {
        // Transfer expired, return money to source account
        this.accounts.get(transfer.sourceAccountId).balance += transfer.amount;
        this.transfers.delete(transferId);
      }
    }
  }
}
