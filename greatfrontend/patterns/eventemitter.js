// You are free to use alternative approaches of
// instantiating the EventEmitter as long as the
// default export has the same interface.


// https://www.greatfrontend.com/questions/javascript/event-emitter

export default class EventEmitter {
  constructor() {
    this.events = Object.create(null); // dont create via {}
    // this is to exclude unwanted prototype such as toString
  }

  // use a map to store all events
  /**
   * @param {string} eventName
   * @param {Function} listener
   * @returns {EventEmitter}
   */
  on(eventName, listener) {
    if (!this.events[eventName]) this.events[eventName] = [];
    this.events[eventName].push(listener);
    return this;
    // fluent API design pattern
  }

  /**
   * @param {string} eventName
   * @param {Function} listener
   * @returns {EventEmitter}
   */
  off(eventName, listener) {
    const listeners = this.events[eventName];
    if (!listeners) return this;

    let listenerIndex = listeners.indexOf(listener);
    if (listenerIndex !== -1) {
      listeners.splice(listenerIndex, 1);
    }
    return this;
  }

  /**
   * @param {string} eventName
   * @param  {...any} args
   * @returns {boolean}
   */
  emit(eventName, ...args) {
    if (!this.events[eventName] || this.events[eventName].length === 0)
      return false;

    const allListeners = this.events[eventName];
    for (const l of allListeners) {
      l(...args);
      // l.apply(emitterInstance, args);
    }

    return true;
  }
}

// emit can be called without any arguments beside eventName
// same listener can be added multiple times with same eventname
// It will be called once for each time it is added when eventName is emitted in the order they were added.
// this refers to the instance of EventEmitter.
// So, return this; means the method returns the same object the method was called on.
// Why Return this? It allows method chaining, like
/*

emitter
  .on('click', handler1)
  .on('click', handler2)
  .off('click', handler1)
  .emit('click');
*/



/*
.apply is a method available on every function (Function.prototype.apply). It calls the function with:

an explicit this value (the first argument)
an array (or array-like) of arguments (the second argument)
In other words, fn.apply(thisArg, argsArray) invokes fn as if you had written fn(arg1, arg2, ..., argN), where argsArray is [arg1, arg2, ..., argN].


Differences: .apply vs .call vs spread
fn.call(thisArg, arg1, arg2, ...) — pass arguments individually.
fn.apply(thisArg, [arg1, arg2, ...]) — pass arguments as an array/array-like.
fn(...args) — ES6 spread syntax; you still need the correct this binding (use fn.call(thisArg, ...args) if you need to set this).


Modern alternatives
Spread operator: fn(...args) — nicer when you don't need to set this.
fn.call(thisArg, ...args) — use if you need to set this and args is an array.
Reflect.apply(fn, thisArg, argsArray) — does the same as apply but as part of the Reflect API:
Reflect.apply(Math.max, null, [5, 1, 9]); // 9

When to use?
Use .apply if you need to call a function with an array-like list of arguments and explicitly set this.
Use spread (fn(...args)) when you just want to pass an array as arguments and you don't need to change ```this```.
Use call(thisArg, ...args) when you want to set this and you can spread args.
Use Reflect.apply when you prefer the Reflect API (clarity and symmetry with other Reflect operations).

Examples
Basic usage

*/

// https://www.patterns.dev/vanilla/observer-pattern/