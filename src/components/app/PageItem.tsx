import DeleteIcon from "@mui/icons-material/Delete";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import { Card, ListItemIcon, ListItemText, Menu, MenuItem, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

import { PREVIEW_PAGE_HEIGHT, PREVIEW_PAGE_WIDTH } from "src/lib/constants";
import { DragItemTypes, PageDragInformation } from "src/lib/drag";
import { useGroupContext } from "src/lib/hooks/useGroupContext";
import { Page } from "src/lib/pdf/group";

import { PagePreview } from "./PagePreview";

export interface PageItemProps {
    /**
     * The page that should be displayed.
     */
    page: Page;
    /**
     * The index of the page.
     */
    pageIndex: number;
    /**
     * The index of the group the page is in.
     */
    groupIndex: number;
}

/**
 * An interactive display of a page item, located inside a group. This can be dragged and rearranged inside groups.
 */
export function PageItem({ page, pageIndex, groupIndex }: PageItemProps) {
    const { inspectPage, removePage: deletePage } = useGroupContext();
    const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number } | null>(null);
    const [{ isDragging }, drag, preview] = useDrag(
        () => ({
            type: DragItemTypes.PAGE,
            item: (): PageDragInformation => {
                return {
                    location: {
                        group: groupIndex,
                        page: pageIndex,
                    },
                    page: page,
                };
            },
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
        }),
        [pageIndex, groupIndex]
    );

    const handleInspect = () => {
        inspectPage({ group: groupIndex, page: pageIndex });
        setContextMenu(null);
    };
    const handleDelete = () => {
        deletePage({ group: groupIndex, page: pageIndex });
        setContextMenu(null);
    };
    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        setContextMenu(!contextMenu ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 } : null);
    };
    const handleContextClose = () => {
        setContextMenu(null);
    };

    useEffect(() => {
        // Ensure that no drag preview is shown, since we want to render it on the drag layer.
        preview(getEmptyImage(), { captureDraggingState: true });
    }, [preview]);

    if (!page) return null;

    return (
        <Stack
            sx={{ position: "relative", cursor: "pointer" }}
            justifyContent="center"
            alignItems="center"
            onContextMenu={handleContextMenu}
        >
            <Card
                ref={drag}
                sx={{ opacity: isDragging ? 0.5 : 1, height: PREVIEW_PAGE_HEIGHT, width: PREVIEW_PAGE_WIDTH }}
                onClick={handleInspect}
            >
                <PagePreview page={page} />
            </Card>
            <Menu
                open={!!contextMenu}
                onClose={handleContextClose}
                anchorReference="anchorPosition"
                anchorPosition={!!contextMenu ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
                PaperProps={{
                    sx: {
                        width: 160,
                    },
                }}
            >
                <MenuItem onClick={handleInspect}>
                    <ListItemIcon>
                        <ZoomInIcon />
                    </ListItemIcon>
                    <ListItemText>Inspect</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                    <ListItemIcon>
                        <DeleteIcon />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>
        </Stack>
    );
}
