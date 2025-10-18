/**
 * @param {number} millis
 * @return {Promise}
 */


// async npt needed as we are returning [promise] anyways.
function sleep(millis) {
    return new Promise((resolve, reject) => {
        try {
            setTimeout(() => resolve(0), millis)
        } catch (error) {
            reject(error)
        }
    });
}

/*
Algorithm
Define an asynchronous function named sleep(millis). This function is expected to pause execution for millis milliseconds before resolving.
Inside this function, construct a new promise object. The executor function of this promise object is where we'll incorporate our delay.
Within the executor function, use the setTimeout method. setTimeout is a method provided by the host environment (web browsers, Node.js, etc.) that executes a provided function or piece of code after a specified delay.
Set the delay of setTimeout to be millis milliseconds. The code to execute after the delay will be the resolve method of the promise.
The resolve method, when called, will mark the promise as fulfilled, allowing any attached .then handlers to execute.
*/

async function sleep(millis) {
    return new Promise(res => setTimeout(res, millis))
}


// quick way, using async await pattern.
/*
For this problem, you don't need to explicitly return anything. This makes the following code a valid solution as well. This version of the sleep function doesn't return anything (or to be more precise, it returns undefined), because there's no return statement. But since the problem statement says, "It can resolve any value", this is perfectly acceptable. It's also a perfectly valid one-liner
*/
async function sleep(millis) {
    await new Promise(resolve => setTimeout(resolve, millis))
}

/** 
 * let t = Date.now()
 * sleep(100).then(() => console.log(Date.now() - t)) // 100
 */