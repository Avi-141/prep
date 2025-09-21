/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} L1
 * @param {ListNode} L2
 * @return {ListNode}
 */

// Digits are stored in FORWARD order. i.e MSD is at head..
// Carry will flow from Least sig end.
// cannot easily start at head.
// "When you wanna go deep and back, think stack, baby!"

// we need to add from the tail back toward the head

var reverseList = function (head) {
    let prevHead = null;
    while (head !== null) {
        let recordNext = head.next;
        head.next = prevHead;
        prevHead = head;
        head = recordNext;
    }
    return prevHead
};


var addTwoNumbersReverseInputList = function (l1, l2) {
    const L1 = reverseList(l1);
    const L2 = reverseList(l2);

    let head = new ListNode(0) // final sum list node.
    let carry = 0;
    let tail = head; // use tail to move.
    while (L1 !== null || L2 !== null || carry !== 0) {
        let sum = 0;
        let x = L1 !== null ? L1.val : 0;
        let y = L2 !== null ? L2.val : 0;
        sum = x + y + carry;
        carry = Math.floor(sum / 10); // if any carr from sum
        tail.next = new ListNode(sum % 10); // next single dig node
        tail = tail.next;
        if (L1 !== null) L1 = L1.next;
        if (L2 !== null) L2 = L2.next;
    }
    return head.next;
};

var addTwoNumbers = function (l1, l2) {
    // we dont reverse any input list
    // we dont use any stack
    // just add as is, store double digits if needed in node
    // then normalize.
    // lets call l1 as larger list and l2 as smaller list
    let largerListSize = 0;
    let smallerListSize = 0;
    for (let node = l1; node !== null; node = node.next) largerListSize++;
    for (let node = l2; node !== null; node = node.next) smallerListSize++;

    if (largerListSize < smallerListSize) {
        let tmpSize = largerListSize;
        largerListSize = smallerListSize;
        smallerListSize = tmpSize
        let tmpList = l1;
        l1 = l2;
        l2 = tmpList;
    }

    let result = null;
    // build partial sums list in reverse order
    // copy leading nodes from the longer list
    for (let i = 0; i < largerListSize - smallerListSize; i++) {
        result = new ListNode(l1.val, result);
        l1 = l1.next;
    }

    // add aligned digits, raw sum;
    for (let i = 0; i < smallerListSize; i++) {
        result = new ListNode(l1.val + l2.val, result);
        l1 = l1.next;
        l2 = l2.next;
    }

    /*
     build a brand-new list result.. 
     but always insert each new node at the front (new ListNode(val, result)), 
    so result grows backwards.
    digit = (rawSum + carry) % 10
    carry = (rawSum + carry) / 10
    */
    // propagate carries and reverse back into a new list
    let carry = 0;
    let node = result;       // head of raw-sum reversed list
    let newResult = null;    // will build the final list in forward order
    while (node !== null) {
        // apply carry
        let r = node.val + carry;
        if (r >= 10) {
            r -= 10;
            carry = 1;
        } else {
            carry = 0;
        }
        node.val = r;
        // detach and push onto newResult
        let nextTemp = node.next;
        node.next = newResult;
        newResult = node;
        node = nextTemp;
    }
    // prepend leftover carry if nonzero
    if (carry > 0) {
        newResult = new ListNode(carry, newResult);
    }
    return newResult;

} 
