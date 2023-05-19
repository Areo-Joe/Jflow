import React, { useCallback, useState } from "react"
import { Box, Center, Grid, Text } from "@mantine/core";
import { ReactFlow, useNodesState, useEdgesState, addEdge, Connection, Node, Edge, ReactFlowInstance, } from "reactflow"
import { edgesObs, nodesObs } from ".";
import { produce } from "immer";
import { useSelector } from "@legendapp/state/react"
import { updateNodes, updateEdges, removeEdge, removeNode } from "./utils/undoable";
import { DragEventHandler } from "react";
import { v4 as uuidv4 } from "uuid"
import { useRef } from "react";

interface AppInterface {
    error: boolean
}

export default function App({ error }: AppInterface) {
    let nodes = useSelector(() => nodesObs!.get());
    let edges = useSelector(() => edgesObs!.get());

    const [reactFlowInstance, setReactFlowInstance] = useState<null | ReactFlowInstance>(null);

    // const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    // const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    let reactFlowWrapper = useRef<null | HTMLDivElement>(null);

    const onDragOver: DragEventHandler = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer!.dropEffect = 'move';
    }, []);

    const onDrop: DragEventHandler = useCallback(event => {
        event.preventDefault();

        const reactFlowBounds = reactFlowWrapper.current!.getBoundingClientRect();
        const type = event.dataTransfer!.getData('application/jflow');

        // check if the dropped element is valid
        if (typeof type === 'undefined' || !type) {
            return;
        }

        const position = reactFlowInstance!.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
        });
        const newNode = {
            id: uuidv4(),
            position,
            data: { label: `${type} node` },
        };
        updateNodes(nodes.concat(newNode))
    }, [reactFlowInstance, nodes]);

    return (
        <Box
            h={"100vh"}
            sx={theme => ({
                backgroundColor: theme.white,
                display: "grid",
                gridTemplateRows: "auto",
                gridTemplateColumns: "100px auto"
            })}>
            <Box
                sx={theme => ({
                    gridRow: "1 / 2",
                    gridColumn: "1 / 2",
                    borderRight: `solid 1px ${theme.primaryColor}`
                })}
            >
                {Array(4).fill(1).map((_, i) => i.toString()).map(x => (
                    <Box
                        onDragStart={e => {
                            e.dataTransfer.setData("application/jflow", x);
                            e.dataTransfer.effectAllowed = "move";
                        }}
                        draggable
                        sx={{ border: "solid 1px black" }}
                    ><Center h={100}>{x}</Center></Box>
                ))}
            </Box>
            <Box
                sx={theme => ({
                    gridRow: "1 / 2",
                    gridColumn: "2 / 3"
                })}
                ref={reactFlowWrapper}
            >
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
                            } else if (change.type === "remove") {
                                removeNode(change.id);
                            }
                        })
                    }}
                    onEdgesChange={changes => {
                        changes.forEach(change => {
                            if (change.type === "remove") {
                                removeEdge(change.id);
                            }
                        })
                    }}
                    onConnect={connnection => {
                        updateEdges(addEdge(connnection, edges))
                    }}
                    onInit={setReactFlowInstance}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                />
            </Box>
        </Box>
    )
}