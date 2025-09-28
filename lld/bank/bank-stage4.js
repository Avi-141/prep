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