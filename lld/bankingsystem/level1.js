

/*

### Level 1:
1, CREATE_ACCOUNT<timestamp><accountId>, returns true if not present and create account, false otherwise
2, DEPOSIT <timestamp><accountId><amount>, deposit given amount of money to the specific account. returns a string
representing total money in the account (balance). If account does not exist, return empty string.
3, PAY <timestamp> <accountId> <amount>, withdraw from the account. returns a string representing account balance
after processing the query. If account does not exist or insufficient fund, return empty string.

*/

export class Bank {
    constructor() {
        this.accounts = new Map();
    }

    createAccount(timestamp, accountId) {
        const doesAccExist = this.accounts.has(accountId)
        if (!doesAccExist) {
            this.accounts.set(accountId, {
                    createdAt: timestamp,
                    updatedAt: timestamp,
                    balance: 0,
                    transactionValue:0,
                })
            return true
        }
        return false;

    }

    deposit(timestamp, accountId, amount) {
        const acc = this.accounts.get(accountId)
        if (!acc || amount < 0) return ''
        const newBalance = acc.balance + amount;
        const val = acc.transactionValue + amount;
        this.accounts.set(accountId, { 
            ...acc, 
            updatedAt: timestamp, 
            balance: newBalance, 
            transactionValue: val
        })
        return `${newBalance}`
    }

    pay(timestamp, accountId, amount) {
        const acc = this.accounts.get(accountId)
        if (!acc || amount < 0) return ''
        const currBalance = acc.balance;
        const newBalance = currBalance - amount;
        if (currBalance < amount) return ''
        const val = acc.transactionValue + amount
        this.accounts.set(accountId, { 
            ...acc, 
            updatedAt: timestamp, 
            balance: newBalance, 
            transactionValue: val
        })
        return `${newBalance}`
    }
}
