/*
Level 4

The banking system should support merging two accounts while retaining both accounts' balance and transaction histories

merge_accounts (self, timestamp: int, account_id_1: str, account_id_2: str) -> bool
- Should merge account_id_2 into the account_id_1.
Returns True if accounts were successfully merged, or False otherwise.
Specifically:
• Returns False If account_id_1 is equal to account_id_2.
• Returns False if account_id_1 or account_id_2 doesn't exist.
• All pending cashback refunds for account_id_2 should still be processed, but refunded to account_id_1 instead.
• After the merge, it must be possible to check the status of payment transactions for account_id_2 with payment
identifiers by replacing account_id_2 with account_id_1
• The balance of account_sa_2 should be added to the balance for account_id_1
• top_spenders operations should recognize merged accounts - the total outgoing transactions for merged accounts
should be the sum of all money transferred and/or withdrawn in both accounts.
• account_id_2 should be removed from the system after the merge.

get_balance(self, timestamp: int, account_id: str, time_at: int) -> int | None
 - Should return the total amount of money in the account account_id at the given timestamp tine_at.
 If the specified account did not exist at a given time time_at, returns None
• If queries have been processed at timestamp time_at, get_balance must reflect the account balance after the query
has been processed.
• If the account was merged into another account, the merged account should inherit its balance history.

Note: Not clear what to return for a get_balance query of a deleted account in the merge. This version returns
the balance by tracing to the target account in the merge.
*/
import { Transfer } from './level3.js';

export class MergeableTransfer extends Transfer {
	constructor() {
		super();
		// DSU parent mapping for merged accounts
		this.parent = new Map();
		// initialize parent for existing accounts
		for (const accId of this.accounts.keys()) {
			this.parent.set(accId, accId);
		}
	}

	// Override to initialize parent mapping when new account is created
	createAccount(timestamp, accountId) {
		const created = super.createAccount(timestamp, accountId);
		if (created) {
			this.parent.set(accountId, accountId);
		}
		return created;
	}

	// Find root account id with path compression
	getRoot(accountId) {
		if (!this.parent.has(accountId)) return null;
		let root = accountId;
		while (this.parent.get(root) !== root) {
			root = this.parent.get(root);
		}
		// path compression
		let curr = accountId;
		while (curr !== root) {
			const next = this.parent.get(curr);
			this.parent.set(curr, root);
			curr = next;
		}
		return root;
	}

	/**
	 * Merge accountId2 into accountId1: combine balances, transaction history, and reassign mappings.
	 */
	mergeAccounts(timestamp, accountId1, accountId2) {
		const root1 = this.getRoot(accountId1);
		const root2 = this.getRoot(accountId2);
		// invalid accounts or same root
		if (!root1 || !root2 || root1 === root2) {
			return false;
		}
		const acc1 = this.accounts.get(root1);
		const acc2 = this.accounts.get(root2);
		// combine balances and transaction values
		this.accounts.set(root1, {
			...acc1,
			updatedAt: timestamp,
			balance: acc1.balance + acc2.balance,
			transactionValue: acc1.transactionValue + acc2.transactionValue
		});
		// Reassign pending transfers: src or tgt from root2 -> root1
		for (const [tid, details] of this.transfers.entries()) {
            // If the transfer’s source was the account being merged away (root2), replace it with the merged-into account (root1). Otherwise leave it untouched.
            // Only if either the source or the target changed do we write back an updated copy of the transfer record under the same transfer ID.
			const src = details.src === root2 ? root1 : details.src;
			const tgt = details.tgt === root2 ? root1 : details.tgt;
			if (src !== details.src || tgt !== details.tgt) {
				this.transfers.set(tid, { ...details, src, tgt });
			}
		}
		// Reassign scheduled payments: accId from root2 -> root1
		for (const sp of this.scheduledPayments.values()) {
			if (sp.accId === root2) {
				sp.accId = root1;
			}
		}
		// Union DSU and remove old account record
		this.parent.set(root2, root1);
		this.accounts.delete(root2);
		return true;
	}
}

/*

Merging accounts is essentially an “aliasing” or “union” problem: 
once A and B are merged, any future lookup for B should really go to A 
(and if A later merges into C, they all point to C, etc.). 
a classic disjoint‐set (union-find) scenario.
When do use DSU? And why here?
we need a quick way to ask “which live account does this ID now belong to?” → find or getRoot.
we need a way to join two sets of IDs under a single representative → union in DSU.
Path compression (flattening the parent pointers) keeps subsequent lookups O(1) amortized.


*/