import React from "react"
import { Box } from "@mantine/core";
import { ReactFlow } from "reactflow"
import { edgesObs, nodesObs } from ".";
import { useSelector } from "@legendapp/state/react"
import { useHandleDrop } from "./utils/useHandleDrop";
import SideBar from "./components/Sidebar";
import { useHandleBasicInteraction } from "./utils/useHandleBasicInteraction";
import LabelNode from "./components/customNodes/labelNode";

interface AppInterface {
    error: boolean
}

let nodeType = {
    labelNode: LabelNode
}

export default function App({ error }: AppInterface) {
    let nodes = useSelector(() => nodesObs!.get());
    let edges = useSelector(() => edgesObs!.get());

    let { getInstance, onDragOver, onDrop, reactFlowWrapper } = useHandleDrop();
    let { onNodesChange, onEdgesChange, onConnect } = useHandleBasicInteraction();

    return (
        <Box
            sx={theme => ({
                backgroundColor: theme.white,
                display: "grid",
                gridTemplateRows: "auto",
                gridTemplateColumns: "100px auto",
                height: "100vh"
            })}>
            <SideBar />
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
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onInit={getInstance}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    nodeTypes={nodeType}
                />
            </Box>
        </Box>
    )
}