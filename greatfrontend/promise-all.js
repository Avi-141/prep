/**
 * @param {Array} iterable
 * @return {Promise<Array>}
 */
export default function promiseAll(iterable) {
  // function needs to return a promise because promises are meant to be chained
  return new Promise((resolve, reject) => {
    const results = new Array(iterable.length);
    let unresolved = iterable.length;

    if (unresolved === 0) {
      resolve(results);
      return;
    }

    iterable.forEach((item, index) => {
      Promise.resolve(item).then(
        (value) => {
          results[index] = value;
          unresolved -= 1;

          if (unresolved === 0) resolve(results);
        },
        (err) => {
          reject(err);
        },
      );
    });
  });
}
// No partial results

/*
const [userData, postsData, tagsData] = await Promise.all([
  fetch('/api/user'),
  fetch('/api/posts'),
  fetch('/api/tags'),
]);
*/
