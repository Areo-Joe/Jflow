import { Edge, Node } from "reactflow";
import { vscode } from "..";

function updateNodes(nodes: Node[]) {
    vscode.postMessage({
        action: "update nodes",
        nodes
    });
}

function updateEdges(edges: Edge[]) {
    vscode.postMessage({
        action: "update edges",
        edges
    });
}

export {
    updateNodes,
    updateEdges
}