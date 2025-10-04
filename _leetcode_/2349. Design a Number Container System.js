class NumberContainers {
    constructor() {
        this.numbersToIndices = new Map(); // all indices num x is at, so we can return smallest.
        // number, minQueue (set of indices)
        this.indexToNumber = new Map(); // insert or replace
    }
}

/** 
 * @param {number} index 
 * @param {number} number
 * @return {void}
 */
NumberContainers.prototype.change = function (index, number) {
        this.indexToNumber.set(index,number);
        const hasNumber = this.numbersToIndices.has(number);
        if(!hasNumber){
            this.numbersToIndices.set(number, new MinPriorityQueue());
            // datastructures-js
            // https://datastructures-js.info/docs/priority-queue
        }
        this.numbersToIndices.get(number).enqueue(index);
};

/** 
 * @param {number} number
 * @return {number}
 */
NumberContainers.prototype.find = function (number) {
    const indices = this.numbersToIndices.get(number);
    if (!indices) return -1;
    while(!indices.isEmpty()){
        const index = indices.front();
        if(this.indexToNumber.get(index) === number) return index
        indices.dequeue();
    }
    return -1
};

/** 
 * Your NumberContainers object will be instantiated and called as such:
 * var obj = new NumberContainers()
 * obj.change(index,number)
 * var param_2 = obj.find(number)
 */