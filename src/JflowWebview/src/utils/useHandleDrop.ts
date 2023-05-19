import { nodesObs } from "..";
import { ReactFlowInstance } from "reactflow";
import { v4 as uuidv4 } from "uuid";
import { updateNodes } from "./undoable";
import { useCallback, useRef, DragEventHandler } from "react";
import { useObservable, useSelector } from "@legendapp/state/react";

function useHandleDrop() {
    let reactFlowInstanceObs = useObservable<null | ReactFlowInstance>(null);
    let reactFlowInstance = useSelector(() => reactFlowInstanceObs.get());
    let reactFlowWrapper = useRef<null | HTMLDivElement>(null);

    let getInstance = useCallback((i: ReactFlowInstance) => {
        reactFlowInstanceObs.set(i)
    }, [reactFlowInstanceObs])

    let nodes = useSelector(() => nodesObs!.get());
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
    return {
        reactFlowWrapper,
        getInstance,
        onDragOver,
        onDrop
    }
}

export {
    useHandleDrop
}