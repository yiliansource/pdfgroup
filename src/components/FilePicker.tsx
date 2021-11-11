import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Stack, Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import clsx from "clsx";
import React, { useState } from "react";

export interface FilePickerProps {
    onChange?(file: File): void;
}

export default function FilePicker({ onChange }: FilePickerProps) {
    const [dragging, setDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };
    const handleDrop = (e: React.DragEvent) => {
        setDragging(false);
        e.preventDefault();

        changeFile(e.dataTransfer.files[0]);
    };

    const changeFile = (file: File) => {
        setFile(file);
        onChange?.(file);
    };

    return (
        <Root
            className={clsx(dragging && "dragging")}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnterCapture={() => setDragging(true)}
            onDragLeave={() => setDragging(false)}
        >
            <Stack alignItems="center" spacing={1}>
                <Typography variant="h5">Drop a PDF here or click to upload one!</Typography>
                <UploadFileIcon sx={{ fontSize: 32 }} />
            </Stack>
            <input type="file" onChange={(e) => changeFile(e.target.files![0])} />
        </Root>
    );
}

const Root = styled(Box)({
    position: "relative",
    padding: "50px",
    background: "#F0F0F0",
    color: "#7E7E7E",
    border: "2px dashed #CDCDCD",
    borderRadius: "4px",
    cursor: "pointer",

    "&.dragging": {
        cursor: "grabbing",
        background: "#ecefff",
        borderColor: "#a8aaca",
    },

    "*": {
        userSelect: "none",
        pointerEvents: "none",
    },

    input: {
        position: "absolute",
        pointerEvents: "all",
        opacity: 0,
        cursor: "inherit",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
    },
});
