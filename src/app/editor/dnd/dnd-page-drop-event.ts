import { DndDropEvent } from 'ngx-drag-drop';

import { DndEventType } from '@pdfgroup/editor/dnd/dnd-event-type';
import { VirtualPageIndex } from '@pdfgroup/editor/util/virtual-page-index';

export interface DndPageDropEvent extends DndDropEvent {
    type: DndEventType.Page;
    data: VirtualPageIndex;
}

export function isDndPageDropEvent(event: DndDropEvent): event is DndPageDropEvent {
    return event.type === DndEventType.Page;
}
