class MyPromise {
  constructor(executor) {
    this.state = 'pending'; // pending, fulfilled, rejected
    this.value = undefined;
    this.handlers = [];

    const resolve = (result) => {
      if (this.state !== 'pending') return;
      
      // Handle thenable resolution
      if (result && (typeof result === 'object' || typeof result === 'function')) {
        const then = result.then;
        if (typeof then === 'function') {
          then.call(result, resolve, reject);
          return;
        }
      }
      
      this.state = 'fulfilled';
      this.value = result;
      this.handlers.forEach(handler => this.handle(handler));
    };

    const reject = (error) => {
      if (this.state !== 'pending') return;
      
      this.state = 'rejected';
      this.value = error;
      this.handlers.forEach(handler => this.handle(handler));
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  handle(handler) {
    if (this.state === 'pending') {
      this.handlers.push(handler);
      return;
    }

    // Execute asynchronously (key requirement!)
    setTimeout(() => {
      const callback = this.state === 'fulfilled' 
        ? handler.onFulfilled 
        : handler.onRejected;

      if (!callback) {
        // Pass through to next promise
        if (this.state === 'fulfilled') {
          handler.resolve(this.value);
        } else {
          handler.reject(this.value);
        }
        return;
      }

      try {
        const result = callback(this.value);
        handler.resolve(result);
      } catch (error) {
        handler.reject(error);
      }
    }, 0);
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      this.handle({
        onFulfilled: typeof onFulfilled === 'function' ? onFulfilled : null,
        onRejected: typeof onRejected === 'function' ? onRejected : null,
        resolve,
        reject
      });
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  // Static method: MyPromise.resolve()
  static resolve(value) {
    // If it's already a MyPromise, return it
    if (value instanceof MyPromise) {
      return value;
    }
    
    return new MyPromise(resolve => resolve(value));
  }

  // Static method: MyPromise.reject()
  static reject(error) {
    return new MyPromise((_, reject) => reject(error));
  }
}