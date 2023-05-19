import React, { useCallback } from "react"
import { Box } from "@mantine/core";
import { ReactFlow, useNodesState, useEdgesState, addEdge, Connection, Node, Edge } from "reactflow"
import { edgesObs, nodesObs } from ".";
import { produce } from "immer";
import { useSelector } from "@legendapp/state/react"
import { updateNodes, updateEdges } from "./utils/undoable";

interface AppInterface {
    error: boolean
}

export default function App({ error }: AppInterface) {
    let nodes = useSelector(() => nodesObs!.get());
    let edges = useSelector(() => edgesObs!.get());

    // const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    // const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    return (
        <Box
            h={"100vh"}
            sx={theme => ({
                backgroundColor: theme.white
            })}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={changes => {
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
                                updateNodes(nodes);
                            }
                        }
                    })
                }}
                onEdgesChange={changes => {
                    
                }}
                onConnect={connnection => {
                    updateEdges(addEdge(connnection, edges))
                }} />
        </Box>
    )
}