import { Stack } from "@mui/material";
import { styled } from "@mui/system";
import { useRef, useState } from "react";
import { useDrop } from "react-dnd";

import { DragItemTypes, PageDragInformation } from "src/lib/drag";
import { PageLocation, SplitPage } from "src/lib/pdf/splitter";

import { SplitPageItem } from "./SplitPageItem";
import { SplitPagePlaceholder } from "./SplitPagePlaceholder";

export interface SplitPageListProps {
    pages: SplitPage[];
    groupIndex: number;

    movePage(source: PageLocation, dest: PageLocation): void;
}

const PAGE_WIDTH = 127,
    PAGE_SPACING = 8;

export function SplitPageList({ pages, groupIndex, movePage }: SplitPageListProps) {
    const [dropIndex, setDropIndex] = useState(2);
    const listRef = useRef<HTMLDivElement | null>(null);

    const [{ isOver, canDrop, item }, drop] = useDrop(
        () => ({
            accept: DragItemTypes.PAGE,
            drop: (item: PageDragInformation) => {
                // we dont render adjacent placeholders, so we need to adjust the drop index, if it's greater
                // than the actual page index, but only if the item is in the same group.
                let adjustedDropIndex = dropIndex;
                if (item.location.group === groupIndex && item.location.page < dropIndex) adjustedDropIndex--;

                movePage(item.location, {
                    group: groupIndex,
                    page: adjustedDropIndex,
                });
            },
            hover: (item: PageDragInformation, monitor) => {
                // placeholder index is calculated as a combination of the horizontal offset, page width and spacing
                if (!listRef.current) throw new Error("No reference to the page list was created.");

                const p =
                    monitor.getClientOffset()!.x -
                    (listRef.current.offsetLeft - listRef.current.parentElement!.scrollLeft);

                let i = Math.ceil((p - PAGE_WIDTH) / (PAGE_WIDTH + PAGE_SPACING));

                // clamp the index to the array
                i = Math.min(pages.length, Math.max(0, i));

                setDropIndex(i);
            },
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
                canDrop: !!monitor.canDrop(),
                item: monitor.getItem<PageDragInformation>(),
            }),
        }),
        [groupIndex, dropIndex]
    );

    const pageList: JSX.Element[] = [];

    pages.forEach((page, index) => {
        if (isOver && canDrop) {
            if (dropIndex === index) {
                // don't render adjacent placeholders
                if (
                    !item ||
                    item.location.group !== groupIndex ||
                    !(item.location.page === dropIndex || item.location.page === dropIndex - 1)
                ) {
                    pageList.push(getPlaceholder());
                }
            }
        }

        pageList.push(<SplitPageItem key={page.id} page={page} groupIndex={groupIndex} pageIndex={index} />);
    });

    if (isOver && canDrop && dropIndex >= pages.length) {
        // since we do not render adjacent placeholders, we check if the last item of the group is the dragged one.
        if (!item || item.location.group !== groupIndex || item.location.page !== pages.length - 1) {
            pageList.push(getPlaceholder());
        }
    }

    return (
        <Root ref={drop}>
            <Stack direction="row" spacing={1} ref={listRef}>
                {pageList}
            </Stack>
        </Root>
    );
}

function getPlaceholder() {
    return <SplitPagePlaceholder key="placeholder" />;
}

const Root = styled("div")({
    minHeight: "210px",
    overflowX: "auto",
});
