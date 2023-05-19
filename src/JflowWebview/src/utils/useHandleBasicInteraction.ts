import { Connection, EdgeChange, NodeChange, addEdge } from "reactflow";
import { updateEdges, updateNodes, removeEdge, removeNode } from "./undoable";
import { produce } from "immer";
import { nodesObs, edgesObs } from "..";
import { useCallback } from "react";

function useHandleBasicInteraction() {
    const onNodesChange = useCallback((changes: NodeChange[]) => {
        console.log(...changes)
        changes.forEach(change => {
            if (change.type === "position") {
                if (change.position) {
                    nodesObs!.set(nodes => produce(nodes, draftNodes => {
                        let index = draftNodes.findIndex(x => x.id === change.id);
                        draftNodes[index].position = change.position!;
                    }))
                }
                if (change.dragging === false) {
                    updateNodes(nodesObs!.get());
                }
            } else if (change.type === "remove") {
                removeNode(change.id);
            }
        });
    }, []);

    const onEdgesChange = useCallback((changes: EdgeChange[]) => {
        changes.forEach(change => {
            if (change.type === "remove") {
                removeEdge(change.id);
            }
        });
    }, []);

    const onConnect = useCallback((connection: Connection) => {
        updateEdges(addEdge(connection, edgesObs!.get()))
    }, []);

    return {
        onNodesChange,
        onEdgesChange,
        onConnect
    }
}

export {
    useHandleBasicInteraction
}