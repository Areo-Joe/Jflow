import { Node } from "reactflow";
import { vscode } from "..";

function updateNodes(nodes: Node[]) {
    vscode.postMessage({
        action: "update nodes",
        nodes
    });
}

export {
    updateNodes
}