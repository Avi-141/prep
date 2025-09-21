var reverseLinkedList = function (startNode, k) {
    let reversedHead = null;
    let current = startNode;
    while (k > 0) {
        let nextTemp = current.next;
        current.next = reversedHead;
        reversedHead = current;
        current = nextTemp;
        k--;
    }
    return reversedHead;
};

/*
    Tracing reverseLinkedList(startNode, k) on [1] → [2] → null with k=2:

    startNode:       [1] → [2] → null
    reversedHead:    null
    current:         startNode ([1] → [2] → null)
    k:               2

    Iteration 1 (k→1):
        nextTemp = current.next        // [2] → null
        current.next = reversedHead    // 1.next = null → [1] → null
        reversedHead = current         // reversedHead → [1] → null
        current = nextTemp             // current → [2] → null

    State after 1st pass:
        reversedHead → [1] → null
        current       [2] → null
        k = 1

    Iteration 2 (k→0):
        nextTemp = current.next        // null
        current.next = reversedHead    // 2.next = [1] → null → [2] → [1] → null
        reversedHead = current         // reversedHead → [2] → [1] → null
        current = nextTemp             // current → null

    k = 0 → loop ends
    return reversedHead             // [2] → [1] → null
*/

var reverseKGroupRecursive = function (head, k) {
    // reverse first k nodes via recursion, if available
    let count = 0;
    let ptr = head;
    while (count < k && ptr !== null) {
        ptr = ptr.next;
        count++;
    }
    if (count === k) {
        // reverse this chunk
        let revHead = reverseLinkedList(head, k);
        // recurse on the remainder and attach
        head.next = reverseKGroupRecursive(ptr, k);
        return revHead;
    }
    return head;
};

// Iterative version: reverse nodes in k-group repeatedly
var reverseKGroup = function (head, k) {
    // we need to connect the tail of reverse sublist to reversed head of next sublist
    /*
        We need to maintain four different variables in this algorithm as we chug along:
        1. head : which will always point to the original head of the next set of k nodes.
        2. revHead : which is basically the tail node of the original set of k nodes. Hence, this becomes the new head after reversal.
        3. ktail : is the tail node of the previous set of k nodes after reversal.
        4. newHeadOfReversedList : acts as the head of the final list that we need to return as the output. 
        Basically, this is the kth node from the beginning of the original list
    */
    let newHead = null;
    let ktail = null;
    while (true) {
        // check if there are k nodes remaining
        let count = 0;
        let ptr = head;
        while (count < k && ptr !== null) {
            ptr = ptr.next;
            count++;
        }
        if (count < k) {
            // fewer than k left, attach remainder and break
            if (ktail) ktail.next = head;
            break;
        }
        // reverse next k nodes
        let revHead = reverseLinkedList(head, k);
        // set newHead if first segment size k of the list
        if (!newHead) newHead = revHead;
        // connect previous segment tail to new head
        if (ktail) ktail.next = revHead;
        // move ktail to the tail of this segment (original head)
        ktail = head;
        // advance head to the next segment
        head = ptr;
    }
    return newHead || head;
};