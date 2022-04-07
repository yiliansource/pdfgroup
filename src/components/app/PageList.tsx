import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import { useRef, useState } from "react";
import { useDrop } from "react-dnd";
import { useRecoilValue } from "recoil";

import { groupPagesAtom } from "src/lib/atoms/groupPagesAtom";
import { PREVIEW_PAGE_HEIGHT, PREVIEW_PAGE_SPACING, PREVIEW_PAGE_WIDTH } from "src/lib/constants";
import { DragItemTypes, PageDragInformation } from "src/lib/drag";
import { useGroupContext } from "src/lib/hooks/useGroupContext";
import { Page } from "src/lib/pdf/group";

import { PageItem } from "./PageItem";
import { PagePlaceholder } from "./PagePlaceholder";

export interface PageListProps {
    group: string;
}

/**
 * A list view of all pages inside a group.
 */
export function PageList({ group }: PageListProps) {
    const [dropIndex, setDropIndex] = useState(0);
    const listRef = useRef<HTMLDivElement | null>(null);

    const pages = useRecoilValue(groupPagesAtom(group));

    const [{ isOver, canDrop, item }, drop] = useDrop(
        () => ({
            accept: DragItemTypes.PAGE,
            drop: (item: PageDragInformation) => {
                // We don't render adjacent placeholders, so we need to adjust the drop index, if it's greater
                // than the actual page index, but only if the item is in the same group.
                let adjustedDropIndex = dropIndex;
                // if (item.location.group === groupIndex && item.location.page < dropIndex) adjustedDropIndex--;

                // movePage(item.location, {
                //     group: groupIndex,
                //     page: adjustedDropIndex,
                // });
            },
            hover: (_, monitor) => {
                if (!listRef.current) throw new Error("No reference to the page list was created.");

                // The placeholder index is calculated as a combination of the horizontal offset, page width and spacing.
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
        [group, dropIndex, pages]
    );

    const pageList: JSX.Element[] = [];

    // TODO: Not rendering a placeholder index next to adjacent pages might be confusing. We should try out hiding
    // it from the list entirely, always rendering the placeholder index, no matter what.

    pages.forEach((page, index) => {
        if (isOver && canDrop) {
            if (dropIndex === index) {
                // Don't render adjacent placeholders.
                // if (
                //     !item ||
                //     item.location.group !== groupIndex ||
                //     !(item.location.page === dropIndex || item.location.page === dropIndex - 1)
                // ) {
                //     pageList.push(getPlaceholder());
                // }
            }
        }

        pageList.push(<PageItem key={page} page={page} group={group} />);
    });

    // if (isOver && canDrop && dropIndex >= pages.length) {
    //     // Since we do not render adjacent placeholders, we check if the last item of the group is the dragged one.
    //     if (!item || item.location.group !== groupIndex || item.location.page !== pages.length - 1) {
    //         pageList.push(getPlaceholder());
    //     }
    // }

    return (
        <Box ref={drop} minHeight={PREVIEW_PAGE_HEIGHT + 30} sx={{ overflowX: "auto" }}>
            <Stack direction="row" spacing={PREVIEW_PAGE_SPACING + "px"} ref={listRef}>
                {pageList}
            </Stack>
        </Box>
    );
}

function getPlaceholder() {
    return <PagePlaceholder key="placeholder" />;
}
