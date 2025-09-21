/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {boolean}
 */
// Time O(N) space O(1)
// https://leetcode.com/problems/palindrome-linked-list/editorial
var reverseLL = function (head) {
    let prev = null;
    let curr = head;
    while(curr!==null){
        let nextTemp = curr.next;
        curr.next = prev;
        prev = curr
        curr = nextTemp
    }
    return prev;
}

var endOfFirstHalfOfList = function(head){
    let fastPtr = head
    let slowPtr = head;
    while(fastPtr.next !==null && fastPtr.next.next !==null){
        fastPtr = fastPtr.next.next
        slowPtr = slowPtr.next;
    }
    // when fast ptr reaches end of LL, slow is at mid.
    // 2 nodes at a time, 1 node at a time
    return slowPtr;
}


var isPalindrome = function(head) {
    if (head === null) return true;
    // Find end of first half and reverse second half.
    const firstHalfEnd = endOfFirstHalfOfList(head);
    const secondHalfStart = reverseLL(firstHalfEnd.next);
    // Check whether or not there is a palindrome.
    let p1 = head;
    let p2 = secondHalfStart;
    let result = true;
    while (result && p2 !== null) {
        if (p1.val !== p2.val) result = false;
        p1 = p1.next;
        p2 = p2.next;
    }
    // Restore the list.
    firstHalfEnd.next = reverseLL(secondHalfStart);
    return result;
};
/*
Find the end of the first half.
Reverse the second half.
Determine whether or not there is a palindrome.
Restore the list.
Return the result.
*/

/*
The downside of this approach is that in a concurrent environment (multiple threads and processes accessing the same data), 
access to the Linked List by other threads or processes would have to be locked while this function is running, 
because the Linked List is temporarily broken. This is a limitation of many in-place algorithms though
*/