import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Button, Stack, Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import { useRef } from "react";
import { useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";

export interface FilePickerProps {
    accept?: string;

    onChange?(file: File): void;
}

export function FilePicker({ accept, onChange }: FilePickerProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [{ isDropping }, drop] = useDrop<{ files: File[] }, void, { isDropping: boolean }>(() => ({
        accept: NativeTypes.FILE,
        drop: (item) => {
            const file = item.files[0];
            if (testExtension(file, accept)) {
                onChange?.(file);
            }
        },
        collect: (monitor) => ({
            isDropping: !!monitor.isOver() && !!monitor.canDrop(),
        }),
    }));

    return (
        <Root ref={drop}>
            <HiddenInput
                type="file"
                accept={accept}
                ref={inputRef}
                onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                        const file = e.target.files[0];
                        onChange?.(file);
                    }
                }}
            />

            <Stack minHeight={300} spacing={1} justifyContent="center" alignItems="center">
                {!isDropping ? (
                    <>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<UploadFileIcon />}
                            onClick={() => inputRef.current?.click()}
                        >
                            Select PDF file
                        </Button>
                        <Typography fontSize={14} color="GrayText">
                            or drop the files into the area
                        </Typography>
                    </>
                ) : (
                    <Typography fontStyle="italic">Drop it like it&apos;s hot!</Typography>
                )}
            </Stack>
        </Root>
    );
}

const Root = styled(Box)({
    border: "2px dashed #ccc",
    borderRadius: 6,
});

const HiddenInput = styled("input")({
    position: "absolute",
    width: 0,
    height: 0,
    opacity: 0,
});

function testExtension(file: File, accept?: string) {
    return !accept || accept.split(",").some((ext) => file.name.endsWith(ext));
}
