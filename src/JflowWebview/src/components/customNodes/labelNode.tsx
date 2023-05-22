import { useObservable, useSelector } from '@legendapp/state/react';
import React, { ChangeEventHandler, useCallback, useEffect, useRef } from 'react';
import { Box, TextInput, Title } from '@mantine/core';
import { Handle, Position } from 'reactflow';

export default function LabelNode({ data, isConnectable }: { data: { label: string }, isConnectable: boolean }) {
    let labelObs = useObservable(data.label);
    let labelVal = useSelector(() => labelObs.get());

    let inputShowObs = useObservable(false);
    let inputShowVal = useSelector(() => inputShowObs.get());

    const onChange: ChangeEventHandler<HTMLInputElement> = useCallback((evt) => {
        labelObs.set(evt.target.value.trim());
    }, []);

    let textInputRef = useRef<null | HTMLInputElement>(null);

    useEffect(() => {
        inputShowVal && textInputRef.current?.focus();
    }, [inputShowVal]);

    return (
        <Box
            sx={theme => ({
                border: "1px solid #eee",
                padding: 5,
                borderRadius: 5,
                background: theme.white
            })}
            className="text-updater-node"
        >
            <Handle
                type="target"
                position={Position.Top}
                isConnectable={isConnectable}
            />
            <Box
                sx={theme => ({
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                })}>
                <Title
                    sx={theme => ({
                        display: !inputShowVal ? "initial" : "none"
                    })}
                    onDoubleClick={() => {
                        inputShowObs.set(x => !x);
                    }}
                    color={"black"}
                    order={6}
                >
                    {labelVal.length === 0 ? "UNSET" : labelVal}
                </Title>
                <TextInput
                    ref={textInputRef}
                    sx={theme => ({
                        visibility: inputShowVal ? "visible" : "hidden",
                        position: inputShowVal ? "initial" : "absolute"
                    })}
                    onChange={onChange}
                    onKeyDown={e => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            textInputRef.current?.blur();
                        }
                    }}
                    onBlur={() => inputShowObs.set(x => !x)}
                />
            </Box>
            <Handle
                type="source"
                position={Position.Bottom}
                isConnectable={isConnectable}
            />
        </Box>
    );
}