// FIFO circular queue, which can auto grow
// A circular buffer is used to enable O(1) enqueue and dequeue operations without shifting items. 
// Benefits include a fixed memory footprint, reduced garbage collection, and better CPU cache utilization due to its contiguous array. 
// Unlike linked lists or plain arrays, the circular nature avoids unbounded growth and memory fragmentation. 
// When growing, it's done infrequently with an O(n) cost, maintaining an amortized O(1).

//Without a circular buffer, if we just keep adding to an array, memory usage grows since we can't reuse spaces.
// Circular buffers reuse slots within a fixed size, improving memory efficiency, preventing large indices, and avoiding performance hits. 
// Modulo operation helps wrap around the buffer, with an optional bitmask for powers-of-two sizes. 
// Example: high-rate queues (like UI frames) or Node’s backpressure.

// so..
// Keep indices bounded in [0, capacity) and reuse slots:
// enqueue at tail, then tail = (tail + 1) % capacity
// dequeue from head, then head = (head + 1) % capacity

class Queue {
    constructor(capacity = 16) {
        this.head = 0;
        this.tail = 0;
        this.count = 0;
        // capacity | 0 is a terse way to “make sure capacity is an int”.
        this.buffer = new Array(Math.max(2, capacity | 0))
    }

    grow() {
        const old = this.buffer;
        const n = old.length; // total length of current queue
        const m = this.count // actual items in queue
        const next = new Array(n << 1) // double size

        for (let i = 0; i < m; i++) {
            next[i] = old[(this.head + i)] % n;
            // preserve order regardless of where head is at.
        }
        this.buffer = next;
        this.head = 0;
        this.tail = m
    }

    peek() {
        // If this.count is non-zero (queue has items),
        // return element at front else undefined
        return this.count ? this.buffer[this.head] : undefined
    }

    isEmpty() {
        return this.count === 0;
    }

    enqueue(x) {
        if (this.count === this.buffer.length) this.grow();
        const tail = this.tail
        const queueLen = this.buffer.length;
        this.buffer[tail] = x;
        this.tail = (this.tail + 1) % queueLen;
        this.count += 1
    }

    dequeue() {
        // can only pop from front
        const x = this.buffer[this.head]
        const queueLen = this.buffer.length
        this.head = (this.head + 1) % queueLen
        this.count -= 1;
        return x;
    }

    size() {
        return this.count;
    }

    clear() {
        this.count = 0;
        this.head = 0;
        this.tail = 0
    }
}


// push and pop both ends
class Deque {
    constructor(capacity = 16) {
        this.head = 0;
        this.tail = 0; // points to next empty slot!
        this.count = 0;
        const cap = Number.isFinite(capacity) ? Math.max(2, Math.trunc(capacity)) : 16;
        this.buffer = new Array(cap)
    }


    grow() {
        const old = this.buffer, n = old.length, m = this.count;
        const next = new Array(n << 1);
        for (let i = 0; i < m; i++) next[i] = old[(this.head + i) % n];
        this.buffer = next;
        this.head = 0;
        this.tail = m;
    }

    peekFront() {
        // use head
        return this.count ? this.buffer[this.head] : undefined
    }

    peekBack() {
        // important as circular
        const buffLength = this.buffer.length
        const tailPositionCircularBuffer = ((this.tail - 1) + buffLength) % buffLength
        return this.count ? this.buffer[tailPositionCircularBuffer] : undefined
    }

    isEmpty() {
        return this.count === 0;
    }

    clear() {
        this.tail = 0;
        this.head = 0;
        this.count = 0;
    }

    size() {
        return this.count // how many actually there.
    }

    isFull() {
        return this.count === this.buffer.length
    }

    pushFront(x) {
        // this will use head as we can insert in front, and get new head
        if (this.isFull()) this.grow()
        const newHead = this.head - 1;
        const finalHead = (newHead + this.buffer.length) % this.buffer.length;
        this.buffer[finalHead] = x;
        this.head = finalHead;
        this.count += 1
    }

    pushBack(x) {
        // this uses tail (its like queue enqueue)
        if (this.isFull()) this.grow()
        this.buffer[this.tail] = x;
        const newTail = this.tail + 1;
        const buffLength = this.buffer.length
        const finalTail = (newTail) % buffLength
        this.tail = finalTail;
        this.count += 1
    }

    popFront() {
        // head moves forward (like regular queue dequeue)
        if(this.isEmpty()) return undefined;
        const x = this.buffer[this.head];
        this.head = (this.head + 1) % this.buffer.length;
        this.count -= 1;
        return x;
    }

    popBack() {
        if(this.isEmpty()) return undefined;
        // tail moves backward - get element before current tail
        const prevTail = (this.tail - 1 + this.buffer.length) % this.buffer.length;
        const x = this.buffer[prevTail];
        this.tail = prevTail;
        this.count -= 1;
        return x;
    }
}

// Test Queue
const q = new Queue(4);
q.enqueue('A');
q.enqueue('B'); 
q.enqueue('C');
console.log("Queue peek:", q.peek()); // A
console.log("Queue dequeue:", q.dequeue()); // A
console.log("Queue size:", q.size()); // 2

// Test Deque
const dq = new Deque(4);
// Initial: buffer=[], head=0, tail=0, count=0

dq.pushBack(1);   // buffer=[1, _, _, _], head=0, tail=1, count=1
dq.pushBack(2);   // buffer=[1, 2, _, _], head=0, tail=2, count=2
dq.pushFront(0);  // buffer=[1, 2, _, 0], head=3, tail=2, count=3

console.log(dq.peekFront()); // 0 
console.log(dq.peekBack());  // 2 

dq.popFront();    
// buffer=[1, 2, _, _], head=0, tail=2, count=2, returns 0
dq.popBack();     
// buffer=[1, _, _, _], head=0, tail=1, count=1, returns 2 