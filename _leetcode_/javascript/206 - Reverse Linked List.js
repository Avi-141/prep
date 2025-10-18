/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function(head) {
    let prevHead = null;
    while(head!==null){
        let recordNext = head.next; 
        // we want to ultimately point prevHead to end of list and return it
        head.next = prevHead; // reversal step..
        prevHead = head
        head = recordNext;
    }
    return prevHead
};

/*
Let’s walk through reversing the tiny list

1 → 2 → null

with

prevHead = null
head = node1 (value 1)

–– Iteration 1 ––

recordNext = head.next
• recordNext → node2

head.next = prevHead
• head (node1).next = null
• Now node1 → null

prevHead = head
• prevHead → node1 → null

head = recordNext
• head → node2 → null

State now:

prevHead → 1 → null
head → 2 → null

–– Iteration 2 ––

recordNext = head.next
• recordNext = null

head.next = prevHead
• head (node2).next = node1
• Now node2 → 1 → null

prevHead = head
• prevHead → 2 → 1 → null

head = recordNext
• head = null (loop ends)
*/