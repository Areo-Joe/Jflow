import { Edge, Node } from "reactflow";
import { vscode } from "..";

function updateNodes(nodes: Node[]) {
    vscode.postMessage({
        action: "update nodes",
        nodes
    });
}

function removeNode(id: string) {
    vscode.postMessage({
        action: "remove node",
        id
    });
}

function updateEdges(edges: Edge[]) {
    vscode.postMessage({
        action: "update edges",
        edges
    });
}

function removeEdge(id: string) {
    vscode.postMessage({
        action: "remove edge",
        id
    });
}

export {
    updateNodes,
    removeNode,
    updateEdges,
    removeEdge
}