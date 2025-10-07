// dispatch function to process scheduled payments before executing operation
export function dispatch(instance, timestamp, fn) {
    instance.processScheduledPayments(timestamp);
    return fn();
}
