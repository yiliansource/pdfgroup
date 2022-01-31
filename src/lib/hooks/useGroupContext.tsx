import { createContext, useContext } from "react";

import { GroupEnvironment } from "../pdf/group";
import { PageLocation } from "../pdf/types";

export interface GroupEnvironmentActions {
    movePage(source: PageLocation, dest: PageLocation): void;
    inspectPage(location: PageLocation): void;
    removePage(source: PageLocation): void;
    moveGroup(location: number, dest: number): void;
    renameGroup(index: number, value: string): void;
    removeGroup(index: number): void;
}
export interface GroupContextData extends GroupEnvironmentActions {
    environment: GroupEnvironment;
}

export const GroupContext = createContext<GroupContextData>(null!);

/**
 * Exposes the context of the group application, to provide easy access to environment data and methods.
 */
export function useGroupContext(): GroupContextData {
    return useContext(GroupContext);
}
