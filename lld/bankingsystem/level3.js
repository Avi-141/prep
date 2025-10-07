/*
### Level 3
The banking system should allow scheduling payments and checking the status of scheduled payments.
1, TRANSFER <timestamp> <sourceAccountId> ‹targetAccountId> <amount> - should initiate a transfer between accounts.
The given amount of money should be withdrawn from the source account sourceAccountId and held until the transfer is accepted by the target account targetAccountId, or until the transfer expires. The withheld money is added back to the source account's balance if the transfer expires. 
After the query is processed:
• Returns an empty string if sourceAccountId is equal to targetAccountId.
• Returns an empty string if sourceAccountId or targetAccountId doesn't exist.
• Returns an empty string if the source account sourceAccountId has insufficient funds to perform the transfer.
• The expiration period is 24 hours, which is equal to 24 • 60 • 60 • 1000 = 86400000 milliseconds.  A transfer expires at the beginning of the next millisecond after the expiration period ends.
• A valid Transfer should return a string containing a unique transfer ID in the following format
"transfer[ordinal number of the transfer]", e.g., "transfer1","transfer2", etc.
• For transfers, transaction history for source and target accounts is only updated when the transfer is accepted.
• Transfers count toward the total value of transactions of both source and target accounts.

2, ACCEPT_TRANSFER ‹timestamp> <accountId> <transferId> - Should accept the transfer with the given transferId.
• Returns "true" if the transfer was successfully accepted or "false" otherwise.
• Returns "false" if a transfer with transferId does not exist, was already accepted, or has expired.
• Returns "false" if the given accountId was not the target account for the transfer.


SCHEDULING.
The system should allow scheduling payments and checking the status of scheduled payments.
• SCHEDULE_PAYMENT < timestamp> < accountId> ‹amount > ‹delay> - should schedule a payment which will be performed
at timestamp + delay. Returns a string with a unique identifier for the scheduled payment in the following format:
"payment [ordinal number of the scheduled payment across all accounts]" - e.g.,
"payment1", "payment2", etc. If account id doesn't exist, should return an empty string. The payment is skipped if the specified account has insufficient funds when the payment is performed.
Additional conditions:
• Successful payments should be considered outgoing transactions and included when ranking accounts using the TOP_SPENDERS operation.
• Scheduled payments should be processed before any other transactions at the given timestamp.
• If an account needs to perform several scheduled payments simultaneously, they should be processed in order
 of creation - e.g., "payment1" should be processed before "payment2"

CANCEL_PAYMENT < timestamp> <accountId> <paymentId> - should cancel the scheduled payment with paymentId.
Returns "true" if the scheduled payment is successfully canceled. If payment id does not exist or was already canceled,
 or if account id is different from the source account for the scheduled payment, returns
"false" . Note that scheduled payments must be performed before any CANCEL_PAYMENT operations at the given timestamp.
*/

const TTL = 86400000; // 24 hours in milliseconds

// Encapsulates a scheduled payment's data and status
class ScheduledPayment {
    constructor(id, accId, amt, transferAt) {
        this.id = id;
        this.accId = accId;
        this.amt = amt;
        this.transferAt = transferAt;
        this.isCancelled = false;
        this.status = 'PENDING'; // PENDING, EXECUTED, SKIPPED, CANCELLED
    }
}

import { TopKAccounts } from "./level2.js";

export class Transfer extends TopKAccounts {
    constructor() {
        super();
        this.scheduledPayments = new Map(); // id -> ScheduledPayment
        this.transfers = new Map();
    }

    // In processScheduledPayments i delete entries from this.scheduledPayments while looping it. That can skip over some items or cause confusing behavior. 
    // Better to collect IDs to remove in a first pass, then delete them afterwards.
    // process scheduled paymenbts first
    // check approach and store all to delete then delete..
    processScheduledPayments(timestamp) {
        const toRemove = [];
        for (const [id, sp] of this.scheduledPayments.entries()) {
            if (!sp.isCancelled && sp.transferAt <= timestamp) {
                const res = super.pay(timestamp, sp.accId, sp.amt);
                sp.status = res ? 'EXECUTED' : 'SKIPPED';
                toRemove.push(id);
            }
        }
        for (const id of toRemove) {
            this.scheduledPayments.delete(id);
        }
    }

    transfer(timestamp, src, tgt, amt) {
        // process any due scheduled payments first
        this.processScheduledPayments(timestamp);
        // invalid or same-account
        if (src === tgt || !this.accounts.has(src) || !this.accounts.has(tgt)) {
            return '';
        }
        const srcDetails = this.accounts.get(src);
        // insufficient funds
        if (srcDetails.balance < amt) {
            return '';
        }
        // compute next transfer ID
        const keys = Array.from(this.transfers.keys());
        const nextId = keys.length === 0 ? 1 : keys[keys.length - 1] + 1;
        // record pending transfer and hold funds
        this.transfers.set(nextId, {
            src,
            tgt,
            amt,
            expiresAt: timestamp + TTL,
            accepted: false
        });
        super.pay(timestamp, src, amt);
        return `transfer${nextId}`;
    }

    acceptTransfer(timestamp, accId, transferId) {
        // process any due scheduled payments first
        this.processScheduledPayments(timestamp);
        if (!this.transfers.has(transferId)) {
            return 'false';
        }
        const transferDetails = this.transfers.get(transferId);
        const { src, tgt, expiresAt: expiry, accepted: acceptedStatus, amt } = transferDetails;
        // cannot accept twice or wrong target
        if (acceptedStatus || tgt !== accId) {
            return 'false';
        }
        // expired: refund and remove
        if (timestamp > expiry) {
            this.deposit(timestamp, src, amt);
            this.transfers.delete(transferId);
            return 'false';
        }
        // accept: deposit to target, mark accepted
        super.deposit(timestamp, accId, amt);
        this.transfers.set(transferId, { ...transferDetails, accepted: true });
        return 'true';
    }


    // Scheduled payments should be processed before any other transactions at the given timestamp.
    schedule(timestamp, accId, amt, delay) {
        // process any due scheduled payments first
        this.processScheduledPayments(timestamp);
        // account must exist
        if (!this.accounts.has(accId)) {
            return '';
        }
        // compute next schedPaymentId
        const keys = Array.from(this.scheduledPayments.keys());
        const nextId = keys.length === 0 ? 1 : keys[keys.length - 1] + 1;
        const sp = new ScheduledPayment(nextId, accId, amt, timestamp + delay);
        this.scheduledPayments.set(nextId, sp);
        return `payment${nextId}`;
    }

    cancelPayment(timestamp, accId, paymentId) {
        // process any due scheduled payments first
        this.processScheduledPayments(timestamp);
        const paymentDetails = this.scheduledPayments.get(paymentId);
        if (!paymentDetails || paymentDetails.isCancelled || paymentDetails.accId !== accId) {
            return 'false';
        }
        paymentDetails.isCancelled = true;
        paymentDetails.status = 'CANCELLED';
        return 'true';
    }

    // Returns the status of a scheduled payment: 'PENDING', 'EXECUTED', 'SKIPPED', or 'CANCELLED'
    getPaymentStatus(paymentId) {
        // non-existent payment
        if (!this.paymentStatus.has(paymentId)) {
            return null;
        }
        return this.paymentStatus.get(paymentId);
    }

}

/*
That little _dispatch(timestamp, fn) wrapper is essentially a Method Decorator or Interceptor—sometimes also called an “around advice” in AOP or a small Template Method that injects pre-processing. In JS terms it’s just a higher-order function that wraps your core logic with a scheduling check.
*/