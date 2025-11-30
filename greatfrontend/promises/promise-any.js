/**
 * @param {Array} iterable
 * @return {Promise}
 */
export default function promiseAny(iterable) {
  return new Promise((resolve, reject) => {
    const errors = new Array(iterable.length);
    let pending = iterable.length;

    if (iterable.length === 0) {
      reject(new AggregateError([]));
      return;
    }

    iterable.forEach(async (item, index) => {
      try {
        const value = await item;
        resolve(value);
      } catch (err) {
        errors[index] = err;
        pending--;

        if (pending === 0) {
          reject(new AggregateError(errors));
        }
      }
    });
  });
}


/*

// Say we have 3 promises: [p1, p2, p3]

// p1 rejects → errors[0] = err, pending = 2
// p2 resolves → resolve(p2_value) ← DONE! Promise is settled!
// p3 rejects later → this catch block runs, but resolve() is ignored 
//                     because the promise is already resolved
*/
