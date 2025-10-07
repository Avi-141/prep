/*

### Level 2:
The banking system should support ranking accounts based on total number of transactions.
1, TOP_ACTIVITY <timestamp> <n> return the top n accounts with the highest total value of transactions in descending
order. A string representing an array of accounts and transaction values in this format
"<accountId1>(<transactionValue1>)".
* Total value of transactions is defined as the sum of all transactions for an account (regardless of how the
 transaction affects account balance), including the amount of money deposited, withdrawn,
 and/or successfully transferred (transfers will be introduced on level 3, so you can ignore them for now).
* If less than n accounts exist in the system, return all active accounts (in the described format).

*/
// <accountId1>(<transactionValue1>)


import { Bank } from './level1.js'

export class TopKAccounts extends Bank {
    constructor() {
        super()
        this.topKList = new Map();
    }

    topKActivity(N) {
        // convert accounts map to array of [id, account]
        const entries = Array.from(this.accounts.entries());
        // sort descending by transactionValue
        entries.sort(([, accA], [, accB]) => accB.transactionValue - accA.transactionValue);
        // only return up to N entries
        const count = Math.min(N, entries.length);
        let result = []
        for (let i = 0; i < count; i++) {
            const [id, acc] = entries[i];
            result.push(`${id}(${acc.transactionValue})`)
        }
        return result.join(', ')
    }
}