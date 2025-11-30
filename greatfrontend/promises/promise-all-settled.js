/**
 * @param {Array} iterable
 * @return {Promise<Array<{status: 'fulfilled', value: *}|{status: 'rejected', reason: *}>>}
 */
export default function promiseAllSettled(iterable) {
  return new Promise((resolve, reject) => {
    const results = new Array(iterable.length);
    let pending = iterable.length;

    if (pending === 0) {
      resolve(results);
      return;
    }

    iterable.forEach(async (item, index) => {
      try {
        const val = await item;
        results[index] = {
          status: "fulfilled",
          value: val,
        };
      } catch (err) {
        results[index] = {
          status: "rejected",
          reason: err,
        };
      }
      pending--;
      if (pending === 0) resolve(results);
    });
  });
}
