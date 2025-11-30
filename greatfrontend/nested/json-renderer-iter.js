/*
 Recursive Renderer

  - Problem: Given a JSON-like tree where each node has id, label, and an optional children array,
    render it as nested <ul>/<li> lists with consistent indentation per depth; every node should show
    its label and maintain stable keys so React diffing stays efficient.
  - Requirements: Support arbitrary depth without blowing the stack (e.g., trees hundreds or thousands
    of levels deep). Avoid recursive call-stack growth by using an explicit stack/loop, generator, or
    tail-recursive helper, and ensure the UI stays responsive by batching renders if necessary.
  - Bonus: Allow the consumer to supply a renderer callback so each node can render custom content,
    and expose a toggle to collapse/expand subtrees while preserving the correct indentation.
  - Acceptance: The component should render deeply nested dummy data (simulate depth ~1,000) without
    runtime errors, keep indentation consistent, and update gracefully when the data tree changes.
 */

import React, { useCallback, useMemo, useState } from "react";

export function JsonRenderer({ data, renderNode }) {
  const [collapsedIds, setCollapsedIds] = useState(() => new Set());

  const toggleCollapse = useCallback((id) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const collapsedTree = useMemo(() => {
    if (!data) {
      return [];
    }

    const rootList = [];
    const stack = [
      {
        node: data,
        depth: 0,
        container: rootList,
      },
    ];

    while (stack.length) {
      const { node, depth, container, path = node.id } = stack.pop();
      const hasChildren = Array.isArray(node.children) && node.children.length > 0;
      const isCollapsed = collapsedIds.has(node.id);

      const childElements = [];

      if (hasChildren && !isCollapsed) {
        for (let i = node.children.length - 1; i >= 0; i -= 1) {
          const child = node.children[i];
          stack.push({
            node: child,
            depth: depth + 1,
            container: childElements,
            path: `${path}/${child.id}`,
          });
        }
      }

      const indicator = hasChildren ? (
        <span aria-hidden="true" style={{ marginLeft: 8 }}>
          {isCollapsed ? "[+]" : "[-]"}
        </span>
      ) : null;

      const labelContent = renderNode
        ? renderNode({ node, depth, isCollapsed, toggleCollapse })
        : node.label;

      container.push(
        <li
          key={path}
          style={{
            marginLeft: depth * 20,
            padding: "4px 0",
            listStyle: "none",
          }}
        >
          <div
            onClick={() => hasChildren && toggleCollapse(node.id)}
            style={{
              cursor: hasChildren ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              gap: 4,
              userSelect: "none",
            }}
          >
            {labelContent}
            {indicator}
          </div>
          {!isCollapsed && childElements.length > 0 && <ul>{childElements}</ul>}
        </li>
      );
    }

    return rootList;
  }, [data, collapsedIds, renderNode, toggleCollapse]);

  return <ul>{collapsedTree}</ul>;
}


const deepTree = Array.from({ length: 20 }, (_, level) => ({
    id: `node-${level}`,
    label: `Level ${level}`,
    children: level < 19 ? [/* next node inserted here */] : [],
  }));

  for (let i = 18; i >= 0; i -= 1) {
    deepTree[i].children = [deepTree[i + 1]];
  }

  const wideTree = {
    id: 'root',
    label: 'Root',
    children: [
      ...Array.from({ length: 5 }, (__, idx) => ({
        id: `branch-${idx}`,
        label: `Branch ${idx}`,
        children: Array.from({ length: 3 }, (___, childIdx) => ({
          id: `leaf-${idx}-${childIdx}`,
          label: `Leaf ${idx}.${childIdx}`,
        })),
      })),
      deepTree[0],
    ],
  };
  
  <JsonRenderer data={wideTree} />