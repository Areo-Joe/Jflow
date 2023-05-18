import React from "react";
import { createRoot } from "react-dom/client"
import { MantineProvider } from "@mantine/core"
import { ReactFlowProvider, Node, Edge } from "reactflow";
import { atom, useAtom, PrimitiveAtom , useSetAtom} from "jotai"
import App from "./App";
import "reactflow/dist/style.css"

let app = document.getElementById("app")!;

let root = createRoot(app);

export let nodesAtom: null | PrimitiveAtom<Node[]> = null;
export let edgesAtom: null | PrimitiveAtom<Edge[]> = null;



window.addEventListener("message", e => {
    let nodes = JSON.parse(e.data.text).nodes as Node[];
    let edges = JSON.parse(e.data.text).edges as Edge[];
    if (!nodesAtom) {
        nodesAtom = atom(nodes);
    } else {
        let setNodes = useSetAtom(nodesAtom);
        setNodes(nodes);
    }
    if (!edgesAtom) {
        edgesAtom = atom(edges);
    } else {
        let setNodes = useSetAtom(edgesAtom);
        setNodes(edges);
    }
    root.render(
        <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
                colorScheme: "light",
            }}>
            <App error={e.data.error} />
        </MantineProvider>
    );
});