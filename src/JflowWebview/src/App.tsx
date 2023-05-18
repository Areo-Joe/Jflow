import React, { useCallback } from "react"
import { Box, Center, Text } from "@mantine/core";
import { ReactFlow, useNodesState, useEdgesState, addEdge, Connection, Node, Edge } from "reactflow"
import { atom, useAtom } from "jotai";
import { edgesAtom, nodesAtom } from ".";
import { produce } from "immer";

interface AppInterface {
    error: boolean
}

let nodes = atom(1);

export default function App({ error }: AppInterface) {
    let [nodes, setNodes] = useAtom(nodesAtom!);
    let [edges, setEdges] = useAtom(edgesAtom!);

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
                    console.log(changes.map(x => x.type).join())
                    changes.forEach(change => {
                        if (change.type === "position") {
                            console.log(change.dragging)
                            setNodes(ns =>
                                produce(ns, ns => {
                                    if (change.position) {
                                        ns.find(n => n.id === change.id)!.position = change.position;
                                    }
                                })
                            );
                        }
                    })
                }}
                onEdgesChange={(...p: any) => console.log(p)}
                onConnect={(...p: any) => console.log(p)} />
        </Box>
    )
}