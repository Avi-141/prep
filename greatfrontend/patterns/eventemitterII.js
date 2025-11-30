/*
In the observer pattern (also commonly known as the publish-subscribe model), 
we can observe/subscribe to events emitted by publishers and execute code whenever an event happens.
Implement an EventEmitter class similar to the one in Node.js that follows such an observer pattern. 
The difference between this question and the first Event Emitter question is the way listeners are unsubscribed.
 In this version, there's no emitter.off() method available on the EventEmitter instance. 
 Instead, emitter.on() returns an object that has an off() method.

EventEmitter API
Implement the following classes and APIs:

new EventEmitter()
Creates an instance of the EventEmitter class. Events and listeners are isolated within the EventEmitter instances they're added to, aka listeners shouldn't react to events emitted by other EventEmitter instances.

emitter.on(eventName, listener)
Adds a callback function (listener) that will be invoked when an event with the name eventName is emitted.

Parameter	Type	Description
eventName	string	The name of the event.
listener	Function	The callback function to be invoked when the event occurs.
Returns a subscription object that has an off() method that unsubscribes this listener from the event. More details below.

emitter.emit(eventName[, ...args])
Invokes each of the listeners listening to eventName with the supplied arguments in order.

Parameter	Type	Description
eventName	string	The name of the event.
...args	any	Arguments to invoke the list of listener functions with.
Returns true if the event had listeners, false otherwise.

sub.off()
This object is returned from emitter.on(). Calling sub.off() unsubscribes the respective listener from the event.


NOTES
An event-based interaction model is the most common way of building user interfaces. 
The DOM is also built around this model with the document.addEventListener() and 
document.removeEventListener() APIs to allow responding to events like click, hover, input, etc.


INTERVIEW TIPS
Clarification questions
The following are good questions to ask the interviewer to demonstrate your thoughtfulness. 
Depending on their response, you might need to adjust the implementation accordingly.

Can emitter.emit() be called without any arguments besides the eventName?
Yes, it can be.
Can the same listener be added multiple times with the same eventName?
Yes, it can be. It will be called once for each time it is added when eventName is emitted in the order they were added.
Can non-existent events be emitted?
Yes, but nothing should happen and the code should not error or crash.
What should the this value of the listeners be?
It can be null.
Can sub.off() be called more than once?
Yes it can be, the second call should be a no-op.
Can listeners contain code that invoke methods on the emitter instance?
Yes, but we can ignore that scenario for this question.
What if the listener callbacks throw an error during emitter.emit()?
The error should be caught and not halt the rest of the execution. However, we will not test for this case.
We will handle all the above cases except for the last two cases.


*/

export default class EventEmitter {
  constructor() {
    this.events = new Map();
    this.key = 0;
  }

  /**
   * @param {string} eventName
   * @param {Function} listener
   * @returns {{off: Function}}
   */
  on(eventName, listener) {
    // emitter.on() needs to return an object that has off() method
    // off method containers reference to listeners unique id and eventName '
    // thanks to closures
    if (!this.events.get(eventName)) this.events.set(eventName, new Map());
    const listenerId = this.key++;
    const listenerMap = this.events.get(eventName);
    listenerMap.set(listenerId, listener);

    return {
      // very important
      // Use arrow function so that `this` is preserved.
      off: () => {
        const listeners = this.events.get(eventName);
        if (!listeners) return;
        // Remove this specific listener
        listeners.delete(listenerId);

        // if no listeners left for this event, clean up the event entry
        if (listeners.size === 0) {
          this.events.delete(eventName);
        }
      },
    };
  }

  emit(eventName, ...args) {
    // Early return for non existing eventNames or
    // events without listeners.
    const listeners = this.events.get(eventName);
    if (!listeners || listeners.size === 0) {
      return false;
    }

    // Clone current listeners to avoid issues if `off()` is called while emitting
    // good design
    const currentListeners = Array.from(listeners.values());
    //console.log(currentListeners);

    currentListeners.forEach((listener) => {
      listener(...args);
      //listener.apply(null, args)
    });

    return true;
  }
}
