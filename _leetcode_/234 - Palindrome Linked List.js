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

var reverseLL = function (head) {
    // build a new reversed list copy without modifying the original
    let curr = head;
    let revHead = null;
    while (curr !== null) {
        // prepend a new node with current value
        revHead = new ListNode(curr.val, revHead);
        curr = curr.next;
    }
    return revHead;
}
var isPalindrome = function (head) {
    let origPtr = head;
    let revHead = reverseLL(head);
    let revPtr = revHead;
    let length = 0;
    for (let node = revHead; node !== null; node = node.next) {
        length += 1;
    }
    for (let i = 0; i < length; i++) {
        if (revPtr.val !== origPtr.val) return false;
        origPtr = origPtr.next;
        revPtr = revPtr.next;
    }
    return true;
};