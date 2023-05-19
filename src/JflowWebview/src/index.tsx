import React from "react";
import { createRoot } from "react-dom/client"
import { MantineProvider } from "@mantine/core"
import { ReactFlowProvider, Node, Edge } from "reactflow";
import { observable, ObservableArray } from "@legendapp/state"
import App from "./App";
import "reactflow/dist/style.css"

export const vscode = acquireVsCodeApi();

let app = document.getElementById("app")!;
let root = createRoot(app);

export let nodesObs: null | ObservableArray<Node[]> = null;
export let edgesObs: null | ObservableArray<Edge[]> = null;



window.addEventListener("message", e => {
    let nodes = JSON.parse(e.data.text).nodes as Node[];
    let edges = JSON.parse(e.data.text).edges as Edge[];
    
    if (!nodesObs) {
        nodesObs = observable(nodes);
    } else {
        nodesObs.set(nodes);
    }
    if (!edgesObs) {
        edgesObs = observable(edges);
    } else {
        edgesObs.set(edges);
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