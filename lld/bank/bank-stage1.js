
/*
Stage 1 — Basic Banking
Goal

Implement deposit, withdraw, and transfer with clear return values and error handling.

Public API :
createAccount(accountId: String, initialBalance: long = 0) -> boolean
deposit(accountId: String, amount: long) -> boolean
withdraw(accountId: String, amount: long) -> boolean
transfer(srcId: String, dstId: String, amount: long) -> boolean
getBalance(accountId: String) -> long

Rules

createAccount:
Creates a new account with initialBalance ≥ 0.
Returns false if the account already exists or initialBalance < 0.

deposit: amount > 0, account must exist. Increases balance. Returns true on success.

withdraw: amount > 0, account must exist, and balance must be ≥ amount. Decreases balance. Returns true on success.

transfer: amount > 0, both accounts must exist, source balance ≥ amount.

Atomically withdraw(src) then deposit(dst). Returns true on success.
All failed validations return false (no partial state changes).
No floating point; use integer cents.

Level 1:
1, CREATE_ACCOUNT<timestamp><accountId>, returns true if not present and create account, false otherwise
2, DEPOSIT <timestamp><accountId><amount>, deposit given amount of money to the specific account. returns a string
representing total money in the account (balance). If account does not exist, return empty string.
3, PAY <timestamp> <accountId> <amount>, withdraw from the account. returns a string representing account balance
after processing the query. If account does not exist or insufficient fund, return empty string.

*/

export class Bank {
    /*
     accounts: Map {`accountId`: { balance: long } }
    */
    constructor() {
        this.accounts = new Map();
    }

    doesAccountExist(accountId) {
        return this.accounts.has(accountId);
    }

    getBalance(accountId) {
        return this.accounts.get(accountId)?.balance ?? 0;
    }

    createAccount(accountId, initialBalance) {
        if (this.doesAccountExist(accountId) || initialBalance < 0) return false;
        const balance = initialBalance ?? 0;
        this.accounts.set(accountId, { balance });
        return true;
    }

    deposit(accountId, amt) {
        if (amt <= 0 || !this.doesAccountExist(accountId)) return false;
        const currBalance = this.accounts.get(accountId).balance;
        const futureBalance = currBalance + amt;
        this.accounts.set(accountId, { balance: futureBalance });
        return true;
    }

    withdraw(accountId, amt) {
        if (amt <= 0 || !this.doesAccountExist(accountId)) return false;
        const currBalance = this.accounts.get(accountId).balance;
        if (currBalance < amt) return false;
        const futureBalance = currBalance - amt;
        this.accounts.set(accountId, { balance: futureBalance });
        return true;
    }

    transfer(source, destination, amt) {
        if (amt <= 0 || !this.doesAccountExist(source) || !this.doesAccountExist(destination)) return false;
        const sourceBalance = this.accounts.get(source).balance;
        if (sourceBalance < amt) return false;
        
        // Atomic operation: withdraw from source and deposit to destination
        this.accounts.set(source, { balance: sourceBalance - amt });
        const destBalance = this.accounts.get(destination).balance;
        this.accounts.set(destination, { balance: destBalance + amt });
        return true;
    }

    // Level 1 command processing methods
    processCreateAccount(accountId) {
        return this.createAccount(accountId, 0);
    }

    processDeposit(accountId, amount) {
        if (!this.doesAccountExist(accountId)) return "";
        if (this.deposit(accountId, amount)) {
            return this.getBalance(accountId).toString();
        }
        return "";
    }

    processPay(accountId, amount) {
        if (!this.doesAccountExist(accountId)) return "";
        if (this.withdraw(accountId, amount)) {
            return this.getBalance(accountId).toString();
        }
        return "";
    }
}