// this-demo.js
// Runnable with: node this-demo.js

console.log('--- this demo start ---\n');

// 1. Method vs extracted reference
const obj = {
  name: 'Avi',
  getName() { return this.name; }
};
console.log('1. Method vs extracted reference:');
console.log('obj.getName():', obj.getName());
const extracted = obj.getName;
try {
  console.log('extracted():', extracted());
} catch (e) {
  console.log('extracted() threw:', e && e.message);
}
console.log('extracted.call(obj):', extracted.call(obj));
console.log('');

// 2. Spread vs apply and this
function say(greeting, punctuation) {
  return `${greeting}, ${this && this.name}${punctuation}`;
}
const person = { name: 'Avi' };
const args = ['Hello', '!'];
console.log('2. Spread vs apply and this:');
console.log('say.apply(person, args):', say.apply(person, args));
console.log('say.call(person, ...args):', say.call(person, ...args));
console.log('say(...args) as plain call (this lost):', (() => { try { return say(...args); } catch (e) { return 'threw: '+e.message } })());
console.log('person.say = say; person.say(...args):', ((p,a) => { p.say = say; return p.say(...a); })(person, args));
console.log('');

// 3. Arrow functions ignore this
const arrowObj = { id: 1, arrow: () => this, method() { return this; } };
console.log('3. Arrow functions:');
console.log('arrowObj.method():', arrowObj.method());
console.log('arrowObj.arrow():', arrowObj.arrow());
console.log('arrowObj.arrow.call({id:2}):', arrowObj.arrow.call({id:2}));
console.log('');

// 4. Event/listener style examples (like eventemitter)
function EventEmitterLike() {
  this.handlers = [];
}
EventEmitterLike.prototype.on = function(fn) { this.handlers.push(fn); };
EventEmitterLike.prototype.emit = function(...args) {
  // Option A: call listeners with their own `this` (plain call)
  console.log('4a. Calling listeners with plain call (listener(...args)):');
  this.handlers.forEach(h => {
    try {
      console.log(' listener result:', h(...args));
    } catch (e) { console.log(' listener threw:', e && e.message); }
  });

  // Option B: call listeners with emitter as `this` (apply)
  console.log('4b. Calling listeners with emitter as this (h.apply(this, args)):');
  this.handlers.forEach(h => {
    try {
      console.log(' listener result:', h.apply(this, args));
    } catch (e) { console.log(' listener threw:', e && e.message); }
  });
};

// create emitter and add listeners
const emitter = new EventEmitterLike();
emitter.on(function(a) { return `plain fn this.name=${this && this.name}`; });
emitter.on((a) => { return `arrow fn this.name=${this && this.name}`; });
// add bound function
function namedListener(){ return `named this.name=${this && this.name}`; }
const bound = namedListener.bind({ name: 'bound' });
emitter.on(bound);

// set a name on emitter
emitter.name = 'theEmitter';
emitter.emit('x');

console.log('\n--- this demo end ---');
