import { createContext, useContext } from "react";

import { SplitEnvironment } from "../pdf/splitter";
import { PageLocation } from "../pdf/types";

export interface SplitActions {
    movePage(source: PageLocation, dest: PageLocation): void;
    inspectPage(location: PageLocation): void;
    removePage(source: PageLocation): void;
    moveGroup(location: number, dest: number): void;
    renameGroup(index: number, value: string): void;
    removeGroup(index: number): void;
}
export interface SplitContextData extends SplitActions {
    environment: SplitEnvironment;
}

export const SplitContext = createContext<SplitContextData>(null!);

export function useSplitContext(): SplitContextData {
    return useContext(SplitContext);
}
