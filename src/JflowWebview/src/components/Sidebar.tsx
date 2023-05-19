import React from "react";
import { Box, Center } from "@mantine/core"

export default function SideBar() {
    return (
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
    )
}