import { selectorFamily } from "recoil";

import { groupNameAtom } from "../atoms/groupNameAtom";
import { groupNamePlaceholderSelector } from "./groupNamePlaceholderSelector";

export const groupNameSelector = selectorFamily<string, string>({
    key: "groupNameSelector",
    get:
        (group: string) =>
        ({ get }) => {
            return get(groupNameAtom(group)) || get(groupNamePlaceholderSelector(group));
        },
});
