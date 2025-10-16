/*
Unified Banking System - Combining Level 1, 2, and 3 functionality

### Level 1: Basic Account Operations
1. CREATE_ACCOUNT <timestamp> <accountId> - Create a new account
2. DEPOSIT <timestamp> <accountId> <amount> - Deposit money
3. PAY <timestamp> <accountId> <amount> - Withdraw money

### Level 2: Account Ranking
1. TOP_ACTIVITY <timestamp> <n> - Get top N accounts by transaction value

### Level 3: Transfers and Scheduled Payments
1. TRANSFER <timestamp> <sourceAccountId> <targetAccountId> <amount> - Transfer between accounts
2. ACCEPT_TRANSFER <timestamp> <accountId> <transferId> - Accept a pending transfer
3. SCHEDULE_PAYMENT <timestamp> <accountId> <amount> <delay> - Schedule a payment
4. CANCEL_PAYMENT <timestamp> <accountId> <paymentId> - Cancel a scheduled payment
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

export class BankingSystem {
    constructor() {
        this.accounts = new Map();
        this.scheduledPayments = new Map(); // id -> ScheduledPayment
        this.transfers = new Map();
    }

    // ==================== LEVEL 1: BASIC OPERATIONS ====================

    createAccount(timestamp, accountId) {
        const doesAccExist = this.accounts.has(accountId);
        if (!doesAccExist) {
            this.accounts.set(accountId, {
                createdAt: timestamp,
                updatedAt: timestamp,
                balance: 0,
                transactionValue: 0,
            });
            return true;
        }
        return false;
    }

    deposit(timestamp, accountId, amount) {
        const acc = this.accounts.get(accountId);
        if (!acc || amount < 0) return '';
        
        const newBalance = acc.balance + amount;
        const val = acc.transactionValue + amount;
        
        this.accounts.set(accountId, {
            ...acc,
            updatedAt: timestamp,
            balance: newBalance,
            transactionValue: val
        });
        
        return `${newBalance}`;
    }

    pay(timestamp, accountId, amount) {
        const acc = this.accounts.get(accountId);
        if (!acc || amount < 0) return '';
        
        const currBalance = acc.balance;
        const newBalance = currBalance - amount;
        
        if (currBalance < amount) return '';
        
        const val = acc.transactionValue + amount;
        
        this.accounts.set(accountId, {
            ...acc,
            updatedAt: timestamp,
            balance: newBalance,
            transactionValue: val
        });
        
        return `${newBalance}`;
    }

    // ==================== LEVEL 2: ACCOUNT RANKING ====================

    topKActivity(N) {
        // Convert accounts map to array of [id, account]
        const entries = Array.from(this.accounts.entries());
        
        // Sort descending by transactionValue
        entries.sort(([, accA], [, accB]) => accB.transactionValue - accA.transactionValue);
        
        // Only return up to N entries
        const count = Math.min(N, entries.length);
        const result = [];
        
        for (let i = 0; i < count; i++) {
            const [id, acc] = entries[i];
            result.push(`${id}(${acc.transactionValue})`);
        }
        
        return result.join(', ');
    }

    // ==================== LEVEL 3: TRANSFERS & SCHEDULED PAYMENTS ====================

    processScheduledPayments(timestamp) {
        const toRemove = [];
        
        // Collect all payments that need processing
        for (const [id, sp] of this.scheduledPayments.entries()) {
            if (!sp.isCancelled && sp.transferAt <= timestamp) {
                const res = this.pay(timestamp, sp.accId, sp.amt);
                sp.status = res ? 'EXECUTED' : 'SKIPPED';
                toRemove.push(id);
            }
        }
        
        // Remove processed payments
        for (const id of toRemove) {
            this.scheduledPayments.delete(id);
        }
    }

    transfer(timestamp, src, tgt, amt) {
        // Process any due scheduled payments first
        this.processScheduledPayments(timestamp);
        
        // Invalid or same-account
        if (src === tgt || !this.accounts.has(src) || !this.accounts.has(tgt)) {
            return '';
        }
        
        const srcDetails = this.accounts.get(src);
        
        // Insufficient funds
        if (srcDetails.balance < amt) {
            return '';
        }
        
        // Compute next transfer ID
        const keys = Array.from(this.transfers.keys());
        const nextId = keys.length === 0 ? 1 : keys[keys.length - 1] + 1;
        
        // Record pending transfer and hold funds
        this.transfers.set(nextId, {
            src,
            tgt,
            amt,
            expiresAt: timestamp + TTL,
            accepted: false
        });
        
        // Withdraw from source
        this.pay(timestamp, src, amt);
        
        return `transfer${nextId}`;
    }

    acceptTransfer(timestamp, accId, transferId) {
        // Process any due scheduled payments first
        this.processScheduledPayments(timestamp);
        
        if (!this.transfers.has(transferId)) {
            return 'false';
        }
        
        const transferDetails = this.transfers.get(transferId);
        const { src, tgt, expiresAt: expiry, accepted: acceptedStatus, amt } = transferDetails;
        
        // Cannot accept twice or wrong target
        if (acceptedStatus || tgt !== accId) {
            return 'false';
        }
        
        // Expired: refund and remove
        if (timestamp > expiry) {
            this.deposit(timestamp, src, amt);
            this.transfers.delete(transferId);
            return 'false';
        }
        
        // Accept: deposit to target, mark accepted
        this.deposit(timestamp, accId, amt);
        this.transfers.set(transferId, { ...transferDetails, accepted: true });
        
        return 'true';
    }

    schedule(timestamp, accId, amt, delay) {
        // Process any due scheduled payments first
        this.processScheduledPayments(timestamp);
        
        // Account must exist
        if (!this.accounts.has(accId)) {
            return '';
        }
        
        // Compute next schedPaymentId
        const keys = Array.from(this.scheduledPayments.keys());
        const nextId = keys.length === 0 ? 1 : keys[keys.length - 1] + 1;
        
        const sp = new ScheduledPayment(nextId, accId, amt, timestamp + delay);
        this.scheduledPayments.set(nextId, sp);
        
        return `payment${nextId}`;
    }

    cancelPayment(timestamp, accId, paymentId) {
        // Process any due scheduled payments first
        this.processScheduledPayments(timestamp);
        
        const paymentDetails = this.scheduledPayments.get(paymentId);
        
        if (!paymentDetails || paymentDetails.isCancelled || paymentDetails.accId !== accId) {
            return 'false';
        }
        
        paymentDetails.isCancelled = true;
        paymentDetails.status = 'CANCELLED';
        
        return 'true';
    }

    getPaymentStatus(paymentId) {
        const payment = this.scheduledPayments.get(paymentId);
        return payment ? payment.status : null;
    }

    getAccount(accountId) {
        return this.accounts.get(accountId) || null;
    }

    getAllAccounts() {
        return this.accounts;
    }

    getTransfer(transferId) {
        return this.transfers.get(transferId) || null;
    }
}

export default BankingSystem;
