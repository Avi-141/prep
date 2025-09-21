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

// Digits are stored in FORWARD order. i.e MSD is at head..
// Carry will flow from Least sig end.
// cannot easily start at head.
// "When you wanna go deep and back, think stack, baby!"

// we need to add from the tail back toward the head
var addTwoNumbers = function(l1, l2) {
    
};