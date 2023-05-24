import { selector } from "recoil";

import { groupAtom } from "../atoms/groupAtom";
import { groupPagesAtom } from "../atoms/groupPagesAtom";
import { groupNameSelector } from "./groupNameSelector";

export const exportWarningsSelector = selector({
    key: "exportWarnings",
    get: ({ get }) => {
        const groups = get(groupAtom);

        return {
            noGroups: groups.length === 0,
            emptyGroups: groups.some((g) => get(groupPagesAtom(g)).length === 0),
            duplicateNames: groups.some(
                (g, i) => groups.findIndex((f) => get(groupNameSelector(f)) === get(groupNameSelector(g))) !== i
            ),
        };
    },
});
