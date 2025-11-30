/*
 Recursive Renderer

  - Problem: Given a JSON-like tree where each node has id, label, and an optional children array, render it as nested <ul>/<li> lists with consistent indentation per depth; every node should show its label and maintain stable keys so React diffing stays efficient.
  - Requirements: Support arbitrary depth without blowing the stack (e.g., trees hundreds or thousands of levels deep). Avoid recursive call-stack growth by using an explicit stack/loop, generator, or tail-recursive helper, and ensure the UI stays responsive by batching renders if necessary.
  - Bonus: Allow the consumer to supply a renderer callback so each node can render custom content, and expose a toggle to collapse/expand subtrees while preserving the correct indentation.
  - Acceptance: The component should render deeply nested dummy data (simulate depth ~1,000) without runtime errors, keep indentation consistent, and update gracefully when the data tree changes.
*/

import React, { useState } from "react";

export function JsonRenderer({ data, renderNode }) {
  const [collapsedIds, setCollapsedIds] = useState(new Set());

  const toggleCollapse = (id) => {
   setCollapsedIds((prev)=>{
    const cId = new Set(prev);
    if(cId.has(id)) delete cId.get(id);
    cId.add(id);
   })
  };


  const renderTree = (node, depth = 0) =>{
    const isCollapsed = collapsedIds.has(node.id);
    return (
        <li key={node.id} style={{marginLeft: depth*20}}>
            <div onClick={()=>toggleCollapse(node.id)} style={{cursor:'pointer'}}>
                {node.label} {node.children && ( isCollapsed ? '[+]' : '[-]')}
            </div>
            {node.children && !isCollapsed && (
                <ul>{node.children.map((child) => renderTree(child, depth + 1))}</ul>
            )}
        </li>
    )
  }

  return <ul>{renderTree(data)}</ul>;
}