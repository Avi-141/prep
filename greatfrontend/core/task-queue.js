

// https://medium.com/@griffinmichl/asynchronous-javascript-queue-920828f6327 
// Lets implement a version of task queue in JSfunction 

function createQueue(concurrency = 1) {
  let running = 0;
  const taskQueue = [];

  function runTask(task) {
    running++;
    // task is expected to accept a callback `done`
    task(() => {
      running--;
      if (taskQueue.length > 0) {
        const next = taskQueue.shift();
        runTask(next);
      }
    });
  }

  function enqueue(task) {
    taskQueue.push(task);
  }

  return {
    push(task) {
      if (running < concurrency) {
        runTask(task);
      } else {
        enqueue(task);
      }
    }
  };
}


/*
Modern JS prefers promises or async/await. 
Let’s make a queue where you push functions that return promises (or async functions), 
and push returns a promise that resolves when the task finishes (or rejects if the task errors). 
Also, after finishing a task, we automatically pick the next one.
*/