/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */

// digits stored in reverse order i.e 1st digit is head
// can add left to right
// carry flow is natural


var addTwoNumbers = function (l1, l2) {
    // sum = l1.val + l2.val + carry;
    // carry = sum/10
    // every new node = sum%10
    let head = new ListNode(0); // stays fixed as anchor pointer
    // only to return result
    let carry = 0;
    let tail = head; // tail is responsible to move

    while (l1 !== null || l2 !== null || carry !== 0) {
        let x = l1 !== null ? l1.val : 0;
        let y = l2 !== null ? l2.val : 0
        let sum = x + y + carry;
        carry = Math.floor(sum / 10);
        tail.next = new ListNode(sum % 10);
        tail = tail.next;
        if (l1 !== null) l1 = l1.next;
        if (l2 !== null) l2 = l2.next;
    }
    return head.next;

};

/*
l1 = [2 → 4 → 3] (represents 342)
l2 = [5 → 6 → 4] (represents 465)

build a result list via a dummy head D and a tail pointer.

Initial state:
D(dummy) → ∅
tail -> D;
carry = 0;
p1 → 2 → 4 → 3
p2 → 5 → 6 → 4

Step 1: add 2 + 5 + 0
sum = 7 → digit = 7, carry = 0
Create node(7) and attach:
D → 7
tail → 7
Advance p1→4, p2→6

tail → D → 7
carry=0


Step 2: add 4 + 6 + 0
sum = 10 → digit = 0, carry = 1
Create node(0) and attach:
D → 7 → 0
tail → 0
Advance p1→3, p2→4

D → 7 → 0
↑
tail
carry=1

D (dummy head)
• A “sentinel” node that sits before the real result list.
• Lets us always do tail->next = newNode without having to check “is this the first node?”
• At the end we simply return D->next.

tail
• Always points to the last real node in the result.
• After creating each new digit‐node, we attach it via tail->next and then move tail forward.
• This gives O(1) append each step


2 pointer approach.

Think of D as a fixed “anchor” you’ll return at the end, and tail as your moving “build pointer.”

If you did only
D = D.next = newNode;

you’d move D forward on each insertion—so by the time you’re done, D no longer points at the dummy head, and you’ve lost the start of the list.

By contrast, with
tail.next = newNode;
tail = tail.next;

you keep D anchored at the head (so you can return D.next later) while tail walks forward to append each new node in O(1).


*/

