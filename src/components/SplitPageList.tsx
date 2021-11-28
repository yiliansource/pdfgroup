import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import { useRef, useState } from "react";
import { useDrop } from "react-dnd";

import { PREVIEW_PAGE_HEIGHT, PREVIEW_PAGE_SPACING, PREVIEW_PAGE_WIDTH } from "src/lib/constants";
import { DragItemTypes, PageDragInformation } from "src/lib/drag";
import { SplitPage } from "src/lib/pdf/splitter";
import { PageLocation } from "src/lib/pdf/types";

import { SplitPageItem } from "./SplitPageItem";
import { SplitPagePlaceholder } from "./SplitPagePlaceholder";

export interface SplitPageListProps {
    /**
     * The pages that should be displayed inside the list.
     */
    pages: SplitPage[];
    /**
     * The index of the group the pages are in.
     */
    groupIndex: number;

    /**
     * Handler function to be invoked when the user wants to move a page between two locations.
     */
    movePage(source: PageLocation, dest: PageLocation): void;
    /**
     * Handler function to enlarge a page for preview purposes.
     */
    inspectPage(source: PageLocation): void;
}

/**
 * A list view of all pages inside a group.
 */
export function SplitPageList({ pages, groupIndex, movePage, inspectPage }: SplitPageListProps) {
    const [dropIndex, setDropIndex] = useState(0);
    const listRef = useRef<HTMLDivElement | null>(null);

    const [{ isOver, canDrop, item }, drop] = useDrop(
        () => ({
            accept: DragItemTypes.PAGE,
            drop: (item: PageDragInformation) => {
                // We don't render adjacent placeholders, so we need to adjust the drop index, if it's greater
                // than the actual page index, but only if the item is in the same group.
                let adjustedDropIndex = dropIndex;
                if (item.location.group === groupIndex && item.location.page < dropIndex) adjustedDropIndex--;

                movePage(item.location, {
                    group: groupIndex,
                    page: adjustedDropIndex,
                });
            },
            hover: (_, monitor) => {
                // The placeholder index is calculated as a combination of the horizontal offset, page width and spacing.
                if (!listRef.current) throw new Error("No reference to the page list was created.");

                const p =
                    monitor.getClientOffset()!.x -
                    (listRef.current.offsetLeft - listRef.current.parentElement!.scrollLeft);

                let i = Math.ceil((p - PREVIEW_PAGE_WIDTH) / (PREVIEW_PAGE_WIDTH + PREVIEW_PAGE_SPACING));

                // Clamp the index to the array.
                i = Math.min(pages.length, Math.max(0, i));

                setDropIndex(i);
            },
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
                canDrop: !!monitor.canDrop(),
                item: monitor.getItem<PageDragInformation>(),
            }),
        }),
        [groupIndex, dropIndex, pages]
    );

    const pageList: JSX.Element[] = [];

    // TODO: Not rendering a placeholder index next to adjacent pages might be confusing. We should try out hiding
    // it from the list entirely, always rendering the placeholder index, no matter what.

    pages.forEach((page, index) => {
        if (isOver && canDrop) {
            if (dropIndex === index) {
                // Don't render adjacent placeholders.
                if (
                    !item ||
                    item.location.group !== groupIndex ||
                    !(item.location.page === dropIndex || item.location.page === dropIndex - 1)
                ) {
                    pageList.push(getPlaceholder());
                }
            }
        }

        pageList.push(
            <SplitPageItem
                key={page.id}
                page={page}
                groupIndex={groupIndex}
                pageIndex={index}
                inspectPage={inspectPage}
            />
        );
    });

    if (isOver && canDrop && dropIndex >= pages.length) {
        // Since we do not render adjacent placeholders, we check if the last item of the group is the dragged one.
        if (!item || item.location.group !== groupIndex || item.location.page !== pages.length - 1) {
            pageList.push(getPlaceholder());
        }
    }

    return (
        <Box ref={drop} minHeight={PREVIEW_PAGE_HEIGHT + 30} sx={{ overflowX: "auto" }}>
            <Stack direction="row" spacing={PREVIEW_PAGE_SPACING + "px"} ref={listRef}>
                {pageList}
            </Stack>
        </Box>
    );
}

function getPlaceholder() {
    return <SplitPagePlaceholder key="placeholder" />;
}
