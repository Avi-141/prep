/*

Stage 2 — Top-N by Transaction Count
Goal
Find top N accounts by number of successful transactions.

Public API :
topNByTxnCount(n: int) -> List<String>
getTxnCount(accountId: String) -> long

The banking system should support ranking accounts based on total number of transactions.
1, TOP_ACTIVITY <timestamp> <n> return the top n accounts with the highest total value of transactions in descending
order. A string representing an array of accounts and transaction values in this format
"<accountId1>(<transactionValue1>)".
* Total value of transactions is defined as the sum of all transactions for an account (regardless of how the transaction affects account balance), including the amount of money deposited, withdrawn, and/or successfully transferred (transfers will be introduced on level 3, so you can ignore them for now).
* If less than n accounts exist in the system, return all active accounts (in the described format).

*/

import { Bank } from './bank-stage1.js'

export class BankWithTopN extends Bank {
    constructor() {
        super();
        /*
         txnCounts: Map {`accountId`: long }
        */
        this.txnCounts = new Map();
    }

    getTxnCount(accountId) {
        return this.txnCounts.get(accountId) ?? 0;
    }

    incrementTxnCount(accountId) {
        const currCount = this.getTxnCount(accountId);
        this.txnCounts.set(accountId, currCount + 1);
    }

    deposit(accountId, amt) {
        const success = super.deposit(accountId, amt);
        if (success) this.incrementTxnCount(accountId);
        return success;
    }

    withdraw(accountId, amt) {
        const success = super.withdraw(accountId, amt);
        if (success) this.incrementTxnCount(accountId);
        return success;
    }

    transfer(srcId, dstId, amt) {
        const success = super.transfer(srcId, dstId, amt);
        if (success) {
            this.incrementTxnCount(srcId);
            this.incrementTxnCount(dstId);
        }
        return success;
    }

    getAllAccountsByTxnCount() {
        const txnMapItr = this.txnCounts.keys(); // iterable keys of map, MapIterator
        const txnArray = Array.from(txnMapItr); // convert to array
        /*
        const map = new Map([['a', 1], ['b', 2]]);
        const keys = map.keys();
        console.log(keys); // MapIterator {"a", "b"}
        */
        // sort by txnCount desc, accountId asc
        return txnArray.sort((a, b) => {
            const countA = this.getTxnCount(a);
            const countB = this.getTxnCount(b);
            // if same txnCount, sort by accountId lexicographically ascending
            if (countA === countB) {
                return a.localeCompare(b); // ascending order of accountId
            }
            return countB - countA; // descending order of txnCount
        });
    }

    topNByTxnCount(n) {
        if (n <= 0) return [];
        const sortedAccounts = this.getAllAccountsByTxnCount();
        const topNAccounts = sortedAccounts.slice(0, n);
        for(let i=0;i<topNAccounts.length;i++){
            const accObj = topNAccounts[i];
            const txnCount = this.getTxnCount(accObj);
            topNAccounts[i] = `${accObj}(${txnCount})`;
        }
        return topNAccounts;
    }

}