/*

nested/recursive data structures in frontend interviews

  - “How would you detect and safely serialize an object graph that might contain circular references before storing it in localStorage?” (look for answers using tracking seen nodes/back-references or WeakSet.)
  - “Describe how you’d traverse a deeply nested tree of UI components or menu items without blowing the stack—would you use recursion, an explicit stack, or generators?” (this exposes awareness of call-stack limits and iterative algorithms.)
  - “If you get an arbitrarily nested JSON response, how do you render it in a collapsible tree and keep expand/collapse state performant?” (tests recursive rendering plus state management.)
  - “What strategies do you use to diff and update a huge nested state tree without mutating it?” (Steers the candidate toward immutable helpers or libraries that handle nested updates safely.)

*/

/*

  - Build a recursive renderer: “Given a JSON-like object with children arrays at arbitrary depths, write a component (or helper) that renders it as nested lists with indentation, ensuring it handles large depths without stack overflow 
    (hint: iterative traversal or tail recursion).”
  - Circular reference detection: “Write a function that safely serializes any nested object to JSON by skipping or marking circular references; demonstrate it on an object that references itself and on a tree with shared subtrees.”
  - Nested tree diff/update: “Given two deeply nested state objects, write a function that returns the minimal set of paths whose values differ, so you can selectively update components. Assume leaf values are primitives and nodes are plain objects/arrays.”

*/

/*

  - “Implement a Reddit-style comments section where replies can nest arbitrarily; how do you render it, keep expand/collapse state, and ensure a reply input stays in the right place?” (Drills recursive rendering plus UX state.)
  - “Build a nested checkbox tree (parents toggle children, children bubble state up with indeterminate when partial). How do you model the state updates without mutating the tree?” (Tests tree traversal and immutable updates.)
  - “Given a nested menu (multi-level dropdown or sidebar), implement keyboard navigation (arrow keys, Esc, Enter) that moves through the tree structure intuitively.” (Combines nested DOM structure with interaction logic.)



  - “Create a component that displays arbitrarily nested comments or messages and keeps scroll position stable when new nodes are prepended or removed (e.g., chat history). How do you insert nodes without jumping the viewport?” (Looks for virtualization/position-management awareness.)
   Scroll-stable Nested Feed

  - For “new nodes” we usually mean messages/comments that arrive out of band—older history prepended when you paginate up, or newer chat messages appended—so the component has to keep the viewport from jumping when those nodes are added or removed.
  - Strategy: render the tree inside a scroll container, keep a ref to that container, and before inserting/removing data capture the current scroll offset relative to a stable anchor (e.g., distance from the top of the container to the first visible message). 
    After the DOM update, adjust scrollTop so the anchor stays at the same position. This often means measuring the height delta caused by the new nodes (using getBoundingClientRect) and subtracting it.
  - For nested comments, render recursively (or iteratively) but keep each item keyed; when prepending older comments at the top, compute the height of what gets inserted and bump scrollTop by that amount after React flushes (using requestAnimationFrame or MutationObserver to wait for layout). When appending
    new messages, you can auto-scroll only if the user was already near the bottom.
  - This pattern lets you support chat history and Reddit-style threads without the view snapping as the tree updates.

   Slack/Webex-style chat apps use that same idea:

  - When new messages arrive at the bottom, they append to the list and auto-scroll only if you were already looking at the latest message, so you don’t get yanked away if you’re reading history.
  - When you load older history above the current viewport, they calculate how tall the new chunk is and adjust scrollTop by exactly that height so your view doesn’t jump; that’s the “capture current offset, insert, then restore offset” trick.
  - The nested-comment version just nests that same scroll management inside a recursive rendering tree, but the key is always measuring the DOM delta and updating scrollTop after React flushes.

*/