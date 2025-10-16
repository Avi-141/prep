# React Internals: Technical Deep Dive

## Table of Contents
1. [React Architecture Overview](#react-architecture-overview)
2. [Fiber Architecture](#fiber-architecture)
3. [Reconciliation Algorithm](#reconciliation-algorithm)
4. [Virtual DOM and Diffing](#virtual-dom-and-diffing)
5. [Render and Commit Phases](#render-and-commit-phases)
6. [Hook Implementation](#hook-implementation)
7. [Advanced Concepts](#advanced-concepts)

---

## React Architecture Overview

### Core Concepts

React operates on a **declarative model** where you describe what the UI should look like, and React handles the imperative DOM updates. The architecture consists of several key layers:

1. **React Core** - Component API, createElement, hooks
2. **Reconciler (React Reconciler)** - Diffing algorithm, fiber architecture
3. **Renderer (React DOM, React Native)** - Platform-specific rendering

### High-Level Flow

```
Component renders
    ↓
createElement called (JSX transform)
    ↓
Virtual DOM tree created (React Elements)
    ↓
Reconciliation (Fiber tree construction)
    ↓
Diffing algorithm identifies changes
    ↓
Commit phase updates real DOM
```

---

## Fiber Architecture

### What is Fiber?

Fiber is React's **reconciliation engine** redesigned in React 16. It's a JavaScript object that represents a unit of work.

### Fiber Node Structure

```javascript
{
  // Instance
  tag: WorkTag,              // Component type (FunctionComponent, ClassComponent, etc.)
  type: any,                 // Function/Class for components, string for DOM nodes
  stateNode: any,            // Actual DOM node or component instance
  
  // Fiber Tree Structure
  return: Fiber | null,      // Parent fiber
  child: Fiber | null,       // First child
  sibling: Fiber | null,     // Next sibling
  index: number,             // Index in parent
  
  // Reconciliation
  alternate: Fiber | null,   // Current ↔ Work-in-progress fiber
  effectTag: SideEffectTag,  // What needs to be done (Placement, Update, Deletion)
  
  // State & Props
  pendingProps: any,         // New props from parent
  memoizedProps: any,        // Props used to create output
  memoizedState: any,        // State used to create output
  updateQueue: UpdateQueue,  // Queue of state updates
  
  // Effects
  firstEffect: Fiber | null,
  lastEffect: Fiber | null,
  nextEffect: Fiber | null,
  
  // Scheduling
  lanes: Lanes,              // Priority of this work
  childLanes: Lanes,         // Priority of subtree
  
  // Other
  key: string | number | null,
  ref: Ref,
  mode: TypeOfMode,
}
```

### Fiber Tree Structure

React maintains **two fiber trees**:

1. **Current tree** - Reflects what's rendered on screen
2. **Work-in-progress tree** - Being built during reconciliation

```
        App (current)  ←→  App (work-in-progress)
         ↓                   ↓
       Header              Header
         ↓                   ↓
      MainContent         MainContent
         ↓                   ↓
       Footer              Footer
```

Trees are connected via `alternate` pointers. After commit, work-in-progress becomes current.

### Tree Traversal

Fiber uses a **depth-first traversal**:

```
1. Process current fiber
2. If has child, go to child
3. If no child but has sibling, go to sibling
4. If no sibling, return to parent and check parent's sibling
5. Repeat until root
```

Example tree:
```
       A
      / \
     B   C
    /     \
   D       E
```

Traversal order: A → B → D → (back to B) → (back to A) → C → E

---

## Reconciliation Algorithm

### Overview

Reconciliation is the algorithm React uses to diff two trees and determine what changed. It makes assumptions to run in O(n) instead of O(n³).

### Key Assumptions

1. **Different types produce different trees**
   - `<div>` → `<span>` = destroy and rebuild
   
2. **Keys provide stability across renders**
   - Identifies which items changed/moved/added/removed

3. **Subtree comparison is localized**
   - Only compares nodes at the same level

### Reconciliation Process

#### Step 1: Element Type Comparison

```javascript
// Old tree
<div className="old">
  <Child />
</div>

// New tree
<div className="new">
  <Child />
</div>
```

**Same type** → Update props, keep instance
```javascript
if (oldFiber.type === newElement.type) {
  // Reuse fiber, update props
  workInProgress.stateNode = oldFiber.stateNode;
  workInProgress.alternate = oldFiber;
  oldFiber.alternate = workInProgress;
}
```

**Different type** → Unmount old, mount new
```javascript
if (oldFiber.type !== newElement.type) {
  // Mark old for deletion
  oldFiber.effectTag = Deletion;
  // Create new fiber
  workInProgress = createFiber(newElement);
}
```

#### Step 2: Component Comparison

**Class Components:**
```javascript
// Same instance if same type
// Calls: componentWillReceiveProps, shouldComponentUpdate, componentWillUpdate, render
```

**Function Components:**
```javascript
// No instance, just call function
// Hooks stored in fiber.memoizedState linked list
```

#### Step 3: Recursion on Children

React compares children arrays using keys:

```javascript
// Old children
[
  { key: 'a', type: 'div' },
  { key: 'b', type: 'div' },
  { key: 'c', type: 'div' }
]

// New children
[
  { key: 'c', type: 'div' },
  { key: 'a', type: 'div' },
  { key: 'b', type: 'div' }
]
```

**Without keys:** React would update all three (expensive)
**With keys:** React recognizes reordering (cheap)

### Reconciliation Algorithm Code Flow

```javascript
function reconcileChildren(current, workInProgress, nextChildren) {
  if (current === null) {
    // Mount: create new fibers
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren);
  } else {
    // Update: reconcile existing fibers
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren
    );
  }
}

function reconcileChildFibers(returnFiber, currentFirstChild, newChild) {
  // Handle different child types
  
  if (typeof newChild === 'object' && newChild !== null) {
    if (Array.isArray(newChild)) {
      return reconcileChildrenArray(returnFiber, currentFirstChild, newChild);
    }
    
    if (newChild.$$typeof === REACT_ELEMENT_TYPE) {
      return reconcileSingleElement(returnFiber, currentFirstChild, newChild);
    }
  }
  
  if (typeof newChild === 'string' || typeof newChild === 'number') {
    return reconcileSingleTextNode(returnFiber, currentFirstChild, newChild);
  }
  
  // Delete remaining children
  return deleteRemainingChildren(returnFiber, currentFirstChild);
}
```

---

## Virtual DOM and Diffing

### Virtual DOM Structure

Virtual DOM is a lightweight JavaScript representation of the actual DOM:

```javascript
// JSX
<div className="container">
  <h1>Hello</h1>
  <p>World</p>
</div>

// Becomes React Element (Virtual DOM node)
{
  type: 'div',
  props: {
    className: 'container',
    children: [
      {
        type: 'h1',
        props: { children: 'Hello' }
      },
      {
        type: 'p',
        props: { children: 'World' }
      }
    ]
  },
  key: null,
  ref: null,
  $$typeof: Symbol(react.element)
}
```

### Diffing Algorithm Details

#### Single Element Diffing

```javascript
function reconcileSingleElement(returnFiber, currentFirstChild, element) {
  const key = element.key;
  let child = currentFirstChild;
  
  while (child !== null) {
    // Check if we can reuse this fiber
    if (child.key === key) {
      if (child.elementType === element.type) {
        // Same key and type - reuse
        deleteRemainingChildren(returnFiber, child.sibling);
        const existing = useFiber(child, element.props);
        existing.return = returnFiber;
        return existing;
      } else {
        // Same key, different type - delete all
        deleteRemainingChildren(returnFiber, child);
        break;
      }
    } else {
      // Different key - delete this child
      deleteChild(returnFiber, child);
    }
    child = child.sibling;
  }
  
  // Create new fiber
  const created = createFiberFromElement(element);
  created.return = returnFiber;
  return created;
}
```

#### Array Diffing

```javascript
function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren) {
  let resultingFirstChild = null;
  let previousNewFiber = null;
  let oldFiber = currentFirstChild;
  let lastPlacedIndex = 0;
  let newIdx = 0;
  let nextOldFiber = null;
  
  // Step 1: Update common prefix
  for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
    if (oldFiber.index > newIdx) {
      nextOldFiber = oldFiber;
      oldFiber = null;
    } else {
      nextOldFiber = oldFiber.sibling;
    }
    
    const newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIdx]);
    
    if (newFiber === null) {
      if (oldFiber === null) oldFiber = nextOldFiber;
      break;
    }
    
    if (shouldTrackSideEffects && oldFiber && newFiber.alternate === null) {
      deleteChild(returnFiber, oldFiber);
    }
    
    lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
    
    if (previousNewFiber === null) {
      resultingFirstChild = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }
    previousNewFiber = newFiber;
    oldFiber = nextOldFiber;
  }
  
  // Step 2: All new children processed
  if (newIdx === newChildren.length) {
    deleteRemainingChildren(returnFiber, oldFiber);
    return resultingFirstChild;
  }
  
  // Step 3: All old children processed, mount remaining new
  if (oldFiber === null) {
    for (; newIdx < newChildren.length; newIdx++) {
      const newFiber = createChild(returnFiber, newChildren[newIdx]);
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
      // ... link fibers
    }
    return resultingFirstChild;
  }
  
  // Step 4: Build map of remaining old children
  const existingChildren = mapRemainingChildren(returnFiber, oldFiber);
  
  // Step 5: Process remaining new children using map
  for (; newIdx < newChildren.length; newIdx++) {
    const newFiber = updateFromMap(existingChildren, returnFiber, newIdx, newChildren[newIdx]);
    
    if (newFiber !== null) {
      if (shouldTrackSideEffects && newFiber.alternate !== null) {
        existingChildren.delete(newFiber.key === null ? newIdx : newFiber.key);
      }
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
      // ... link fibers
    }
  }
  
  // Step 6: Delete remaining old children not reused
  if (shouldTrackSideEffects) {
    existingChildren.forEach(child => deleteChild(returnFiber, child));
  }
  
  return resultingFirstChild;
}
```

### Diffing Optimization: Keys

Keys help React identify which items have changed, been added, or removed:

```javascript
// Bad: No keys or index as key
newChildren.map((item, index) => <Item key={index} {...item} />)

// Good: Stable unique keys
newChildren.map(item => <Item key={item.id} {...item} />)
```

**Why index keys are problematic:**

```javascript
// Initial render
[
  <Item key={0} id="a" />,
  <Item key={1} id="b" />,
  <Item key={2} id="c" />
]

// After removing first item
[
  <Item key={0} id="b" />,  // React thinks this is "a" updated
  <Item key={1} id="c" />,  // React thinks this is "b" updated
  // React thinks "c" was deleted
]

// Result: All items re-render instead of just removing one
```

---

## Render and Commit Phases

React's work is split into two main phases:

### Render Phase (Reconciliation)

**Characteristics:**
- Can be interrupted
- Does not produce side effects
- May be called multiple times
- Works on work-in-progress tree

**Work done:**
```javascript
function performUnitOfWork(unitOfWork) {
  const current = unitOfWork.alternate;
  
  // Begin work on this fiber
  let next = beginWork(current, unitOfWork, renderLanes);
  
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  
  if (next === null) {
    // No child, complete this unit
    completeUnitOfWork(unitOfWork);
  } else {
    // Has child, work on it next
    workInProgress = next;
  }
}

function beginWork(current, workInProgress, renderLanes) {
  // Different logic based on tag
  switch (workInProgress.tag) {
    case FunctionComponent:
      return updateFunctionComponent(current, workInProgress, renderLanes);
    case ClassComponent:
      return updateClassComponent(current, workInProgress, renderLanes);
    case HostComponent:
      return updateHostComponent(current, workInProgress);
    // ... other cases
  }
}

function completeWork(current, workInProgress, renderLanes) {
  const newProps = workInProgress.pendingProps;
  
  switch (workInProgress.tag) {
    case HostComponent: {
      // Create or update DOM node
      if (current !== null && workInProgress.stateNode != null) {
        // Update existing
        updateHostComponent(current, workInProgress, newProps);
      } else {
        // Create new
        const instance = createInstance(workInProgress.type, newProps);
        appendAllChildren(instance, workInProgress);
        workInProgress.stateNode = instance;
      }
      break;
    }
  }
}
```

### Commit Phase

**Characteristics:**
- Cannot be interrupted
- Synchronous
- Produces side effects (DOM updates, lifecycle methods)
- Called once per render

**Sub-phases:**

1. **Before Mutation Phase**
   - Run getSnapshotBeforeUpdate
   - Schedule useEffect cleanups

2. **Mutation Phase**
   - Update DOM
   - Execute ref updates
   - Execute layout effects cleanups

3. **Layout Phase**
   - Run useLayoutEffect
   - Run componentDidMount/componentDidUpdate
   - Schedule useEffect

```javascript
function commitRoot(root) {
  const finishedWork = root.finishedWork;
  
  // Before mutation
  commitBeforeMutationEffects(finishedWork);
  
  // Mutation
  commitMutationEffects(finishedWork, root);
  
  // Switch trees
  root.current = finishedWork;
  
  // Layout
  commitLayoutEffects(finishedWork, root);
  
  // Schedule effects
  schedulePassiveEffects(finishedWork);
}

function commitMutationEffects(firstChild, root) {
  let fiber = firstChild;
  
  while (fiber !== null) {
    const flags = fiber.flags;
    
    if (flags & ContentReset) {
      commitResetTextContent(fiber);
    }
    
    if (flags & Ref) {
      const current = fiber.alternate;
      if (current !== null) {
        commitDetachRef(current);
      }
    }
    
    const primaryFlags = flags & (Placement | Update | Deletion);
    
    switch (primaryFlags) {
      case Placement: {
        commitPlacement(fiber);
        fiber.flags &= ~Placement;
        break;
      }
      case Update: {
        const current = fiber.alternate;
        commitWork(current, fiber);
        break;
      }
      case Deletion: {
        commitDeletion(root, fiber);
        break;
      }
    }
    
    fiber = fiber.nextEffect;
  }
}
```

---

## Hook Implementation

### Hook Storage Structure

Hooks are stored as a **linked list** in the fiber's `memoizedState`:

```javascript
fiber.memoizedState = {
  // Hook 1: useState
  memoizedState: value,
  baseState: value,
  queue: updateQueue,
  baseQueue: null,
  next: {
    // Hook 2: useEffect
    memoizedState: {
      tag: HookHasEffect,
      create: effectFunction,
      destroy: cleanupFunction,
      deps: [dep1, dep2],
      next: circularLinkToNextEffect
    },
    next: {
      // Hook 3: useRef
      memoizedState: { current: value },
      next: null
    }
  }
}
```

### useState Implementation

#### State Storage

```javascript
function mountState(initialState) {
  const hook = mountWorkInProgressHook();
  
  if (typeof initialState === 'function') {
    initialState = initialState();
  }
  
  hook.memoizedState = hook.baseState = initialState;
  
  const queue = hook.queue = {
    pending: null,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: initialState
  };
  
  const dispatch = queue.dispatch = dispatchAction.bind(null, currentlyRenderingFiber, queue);
  
  return [hook.memoizedState, dispatch];
}

function updateState(initialState) {
  return updateReducer(basicStateReducer, initialState);
}

function basicStateReducer(state, action) {
  return typeof action === 'function' ? action(state) : action;
}
```

#### Update Queue

```javascript
function dispatchAction(fiber, queue, action) {
  const update = {
    lane: requestUpdateLane(fiber),
    action: action,
    eagerReducer: null,
    eagerState: null,
    next: null
  };
  
  // Append update to circular queue
  const pending = queue.pending;
  if (pending === null) {
    update.next = update; // Point to itself
  } else {
    update.next = pending.next;
    pending.next = update;
  }
  queue.pending = update;
  
  // Eager state calculation (optimization)
  const alternate = fiber.alternate;
  if (
    fiber.lanes === NoLanes &&
    (alternate === null || alternate.lanes === NoLanes)
  ) {
    const lastRenderedReducer = queue.lastRenderedReducer;
    if (lastRenderedReducer !== null) {
      const currentState = queue.lastRenderedState;
      const eagerState = lastRenderedReducer(currentState, action);
      update.eagerReducer = lastRenderedReducer;
      update.eagerState = eagerState;
      
      if (Object.is(eagerState, currentState)) {
        // State hasn't changed, bail out
        return;
      }
    }
  }
  
  // Schedule update
  scheduleUpdateOnFiber(fiber, lane, eventTime);
}
```

#### State Update Processing

```javascript
function updateReducer(reducer, initialArg) {
  const hook = updateWorkInProgressHook();
  const queue = hook.queue;
  
  queue.lastRenderedReducer = reducer;
  
  const current = currentHook;
  let baseQueue = current.baseQueue;
  const pendingQueue = queue.pending;
  
  if (pendingQueue !== null) {
    // Merge pending updates into base queue
    if (baseQueue !== null) {
      const baseFirst = baseQueue.next;
      const pendingFirst = pendingQueue.next;
      baseQueue.next = pendingFirst;
      pendingQueue.next = baseFirst;
    }
    current.baseQueue = baseQueue = pendingQueue;
    queue.pending = null;
  }
  
  if (baseQueue !== null) {
    const first = baseQueue.next;
    let newState = current.baseState;
    let newBaseState = null;
    let newBaseQueueFirst = null;
    let newBaseQueueLast = null;
    let update = first;
    
    do {
      const updateLane = update.lane;
      
      if (!isSubsetOfLanes(renderLanes, updateLane)) {
        // Insufficient priority, skip this update
        const clone = {
          lane: updateLane,
          action: update.action,
          eagerReducer: update.eagerReducer,
          eagerState: update.eagerState,
          next: null
        };
        
        if (newBaseQueueLast === null) {
          newBaseQueueFirst = newBaseQueueLast = clone;
          newBaseState = newState;
        } else {
          newBaseQueueLast = newBaseQueueLast.next = clone;
        }
        
        currentlyRenderingFiber.lanes = mergeLanes(currentlyRenderingFiber.lanes, updateLane);
      } else {
        // This update has sufficient priority
        if (newBaseQueueLast !== null) {
          const clone = {
            lane: NoLane,
            action: update.action,
            eagerReducer: update.eagerReducer,
            eagerState: update.eagerState,
            next: null
          };
          newBaseQueueLast = newBaseQueueLast.next = clone;
        }
        
        // Process this update
        if (update.eagerReducer === reducer) {
          newState = update.eagerState;
        } else {
          const action = update.action;
          newState = reducer(newState, action);
        }
      }
      
      update = update.next;
    } while (update !== null && update !== first);
    
    if (newBaseQueueLast === null) {
      newBaseState = newState;
    } else {
      newBaseQueueLast.next = newBaseQueueFirst;
    }
    
    if (!Object.is(newState, hook.memoizedState)) {
      markWorkInProgressReceivedUpdate();
    }
    
    hook.memoizedState = newState;
    hook.baseState = newBaseState;
    hook.baseQueue = newBaseQueueLast;
    
    queue.lastRenderedState = newState;
  }
  
  const dispatch = queue.dispatch;
  return [hook.memoizedState, dispatch];
}
```

### useEffect Implementation

#### Effect Storage

```javascript
function mountEffect(create, deps) {
  return mountEffectImpl(
    PassiveEffect | PassiveStaticEffect,
    HookPassive,
    create,
    deps
  );
}

function mountEffectImpl(fiberFlags, hookFlags, create, deps) {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  
  currentlyRenderingFiber.flags |= fiberFlags;
  
  hook.memoizedState = pushEffect(
    HookHasEffect | hookFlags,
    create,
    undefined,
    nextDeps
  );
}

function pushEffect(tag, create, destroy, deps) {
  const effect = {
    tag: tag,
    create: create,
    destroy: destroy,
    deps: deps,
    next: null
  };
  
  let componentUpdateQueue = currentlyRenderingFiber.updateQueue;
  
  if (componentUpdateQueue === null) {
    componentUpdateQueue = createFunctionComponentUpdateQueue();
    currentlyRenderingFiber.updateQueue = componentUpdateQueue;
    componentUpdateQueue.lastEffect = effect.next = effect;
  } else {
    const lastEffect = componentUpdateQueue.lastEffect;
    if (lastEffect === null) {
      componentUpdateQueue.lastEffect = effect.next = effect;
    } else {
      const firstEffect = lastEffect.next;
      lastEffect.next = effect;
      effect.next = firstEffect;
      componentUpdateQueue.lastEffect = effect;
    }
  }
  
  return effect;
}
```

#### Effect Execution

```javascript
function updateEffect(create, deps) {
  return updateEffectImpl(PassiveEffect, HookPassive, create, deps);
}

function updateEffectImpl(fiberFlags, hookFlags, create, deps) {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  let destroy = undefined;
  
  if (currentHook !== null) {
    const prevEffect = currentHook.memoizedState;
    destroy = prevEffect.destroy;
    
    if (nextDeps !== null) {
      const prevDeps = prevEffect.deps;
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        // Dependencies haven't changed, don't re-run effect
        pushEffect(hookFlags, create, destroy, nextDeps);
        return;
      }
    }
  }
  
  currentlyRenderingFiber.flags |= fiberFlags;
  
  hook.memoizedState = pushEffect(
    HookHasEffect | hookFlags,
    create,
    destroy,
    nextDeps
  );
}

function areHookInputsEqual(nextDeps, prevDeps) {
  if (prevDeps === null) return false;
  
  for (let i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
    if (Object.is(nextDeps[i], prevDeps[i])) {
      continue;
    }
    return false;
  }
  return true;
}
```

#### Effect Cleanup and Execution

```javascript
function commitHookEffectListUnmount(tag, finishedWork) {
  const updateQueue = finishedWork.updateQueue;
  const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
  
  if (lastEffect !== null) {
    const firstEffect = lastEffect.next;
    let effect = firstEffect;
    
    do {
      if ((effect.tag & tag) === tag) {
        // Unmount
        const destroy = effect.destroy;
        effect.destroy = undefined;
        
        if (destroy !== undefined) {
          destroy();
        }
      }
      effect = effect.next;
    } while (effect !== firstEffect);
  }
}

function commitHookEffectListMount(tag, finishedWork) {
  const updateQueue = finishedWork.updateQueue;
  const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
  
  if (lastEffect !== null) {
    const firstEffect = lastEffect.next;
    let effect = firstEffect;
    
    do {
      if ((effect.tag & tag) === tag) {
        // Mount
        const create = effect.create;
        effect.destroy = create();
      }
      effect = effect.next;
    } while (effect !== firstEffect);
  }
}
```

### useRef Implementation

```javascript
function mountRef(initialValue) {
  const hook = mountWorkInProgressHook();
  const ref = { current: initialValue };
  hook.memoizedState = ref;
  return ref;
}

function updateRef(initialValue) {
  const hook = updateWorkInProgressHook();
  return hook.memoizedState;
}
```

**Why useRef doesn't trigger re-renders:**

The ref object is created once during mount and simply returned on updates. React doesn't track mutations to `ref.current` - it's just a plain JavaScript object mutation, not a state update that goes through the update queue.

---

## Advanced Concepts

### Batching

React batches multiple state updates into a single re-render for performance.

#### Automatic Batching (React 18+)

```javascript
function handleClick() {
  setCount(c => c + 1);  // Doesn't re-render yet
  setFlag(f => !f);      // Doesn't re-render yet
  // React re-renders once at the end
}

// Also works in promises, setTimeout, native event handlers
setTimeout(() => {
  setCount(c => c + 1);  // Batched
  setFlag(f => !f);      // Batched
}, 1000);
```

#### Implementation

```javascript
let executionContext = NoContext;

function batchedUpdates(fn) {
  const prevExecutionContext = executionContext;
  executionContext |= BatchedContext;
  try {
    return fn();
  } finally {
    executionContext = prevExecutionContext;
    if (executionContext === NoContext) {
      flushSyncCallbackQueue();
    }
  }
}
```

### Priority and Lanes

React 18 uses a lanes model for prioritizing updates:

```javascript
const NoLanes = 0b0000000000000000000000000000000;
const SyncLane = 0b0000000000000000000000000000001;
const InputContinuousLane = 0b0000000000000000000000000000100;
const DefaultLane = 0b0000000000000000000000000010000;
const TransitionLane1 = 0b0000000000000000000000001000000;
// ... more lanes

function requestUpdateLane(fiber) {
  const mode = fiber.mode;
  
  if ((mode & ConcurrentMode) === NoMode) {
    return SyncLane;
  }
  
  if (currentEventPriority !== NoLane) {
    return currentEventPriority;
  }
  
  return DefaultLane;
}
```

### Concurrent Features

#### Time Slicing

```javascript
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}

function shouldYield() {
  const currentTime = getCurrentTime();
  return currentTime >= deadline;
}
```

#### Suspense Internals

```javascript
function throwException(root, returnFiber, sourceFiber, value) {
  sourceFiber.flags |= Incomplete;
  
  if (
    value !== null &&
    typeof value === 'object' &&
    typeof value.then === 'function'
  ) {
    // This is a promise (Suspense boundary)
    const wakeable = value;
    
    const suspenseBoundary = getNearestSuspenseBoundary(returnFiber);
    
    if (suspenseBoundary !== null) {
      suspenseBoundary.flags &= ~ForceClientRender;
      markSuspenseBoundaryShouldCapture(suspenseBoundary, returnFiber, sourceFiber);
      
      attachPingListener(root, wakeable, suspenseBoundary);
      
      return;
    }
  }
}
```

### Context Implementation

```javascript
// Context creation
function createContext(defaultValue) {
  const context = {
    $$typeof: REACT_CONTEXT_TYPE,
    _currentValue: defaultValue,
    _currentValue2: defaultValue,
    Provider: null,
    Consumer: null
  };
  
  context.Provider = {
    $$typeof: REACT_PROVIDER_TYPE,
    _context: context
  };
  
  context.Consumer = context;
  
  return context;
}

// Reading context
function readContext(context) {
  const value = context._currentValue;
  
  if (lastContextDependency === null) {
    lastContextDependency = contextDependency;
    currentlyRenderingFiber.dependencies = {
      lanes: NoLanes,
      firstContext: contextDependency,
      responders: null
    };
  } else {
    lastContextDependency = lastContextDependency.next = contextDependency;
  }
  
  return value;
}

// Providing context
function pushProvider(providerFiber, nextValue) {
  const context = providerFiber.type._context;
  
  push(valueCursor, context._currentValue);
  context._currentValue = nextValue;
}
```

### Memory Management

React uses object pooling for fiber nodes to reduce garbage collection pressure:

```javascript
function createFiber(tag, pendingProps, key, mode) {
  return new FiberNode(tag, pendingProps, key, mode);
}

function useFiber(fiber, pendingProps) {
  const clone = createWorkInProgress(fiber, pendingProps);
  clone.index = 0;
  clone.sibling = null;
  return clone;
}

function createWorkInProgress(current, pendingProps) {
  let workInProgress = current.alternate;
  
  if (workInProgress === null) {
    workInProgress = createFiber(
      current.tag,
      pendingProps,
      current.key,
      current.mode
    );
    workInProgress.elementType = current.elementType;
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;
    
    workInProgress.alternate = current;
    current.alternate = workInProgress;
  } else {
    workInProgress.pendingProps = pendingProps;
    workInProgress.type = current.type;
    workInProgress.flags = NoFlags;
    workInProgress.subtreeFlags = NoFlags;
    workInProgress.deletions = null;
  }
  
  // Copy over other fields...
  
  return workInProgress;
}
```

---

## Performance Optimization Internals

### Memoization

```javascript
function updateMemo(nextCreate, deps) {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const prevState = hook.memoizedState;
  
  if (prevState !== null) {
    if (nextDeps !== null) {
      const prevDeps = prevState[1];
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        return prevState[0];
      }
    }
  }
  
  const nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}
```

### Component Bailout

```javascript
function bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes) {
  if (!includesSomeLane(renderLanes, workInProgress.childLanes)) {
    // No pending work in children, can skip entirely
    return null;
  }
  
  // Clone children without re-rendering
  cloneChildFibers(current, workInProgress);
  return workInProgress.child;
}
```

This document provides a comprehensive technical foundation for understanding React's internal workings. Each concept builds on the previous ones to create a complete picture of how React transforms your declarative code into efficient DOM updates.
