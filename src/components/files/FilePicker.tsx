import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Button, Stack, Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import { useRef } from "react";
import { useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";

import { hasExtension } from "src/lib/io/ext";

/**
 * Represents properties accepted on the file picker component.
 */
export interface FilePickerProps {
    /**
     * A list of comma-seperated file extensions to accept as picked/dropped files.
     * This is will also be passed to the underlying <input> field.
     *
     * @example .pdf,.jpeg
     */
    accept?: string;

    /**
     * Called when the user selects a file via drop or the file selection dialog.
     *
     * @param file The selected file.
     */
    onChange?(file: File): void;
}

/**
 * The FilePicker component is used to provide a stylized and convenient way for users to pick files.
 * They can either activate a file dialog via a button, or directly drop a file in the browser to read it.
 */
export function FilePicker({ accept, onChange }: FilePickerProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [{ isDropping }, drop] = useDrop<{ files: File[] }, void, { isDropping: boolean }>(() => ({
        accept: NativeTypes.FILE,
        drop: (item) => {
            const file = item.files[0];
            // Only allow files that match the extension, if desired.
            if (hasExtension(file.name, accept)) {
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
                        // There's no need to test the file extension here, we trust the input dialog filter.
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

/**
 * An <input> element, styled to be invisible to the user, used only internally for browser logic.
 */
const HiddenInput = styled("input")({
    position: "absolute",
    width: 0,
    height: 0,
    opacity: 0,
});
