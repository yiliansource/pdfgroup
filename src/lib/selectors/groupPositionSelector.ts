import { selector, selectorFamily } from "recoil";

import { groupAtom } from "../atoms/groupAtom";

export const groupPositionSelector = selectorFamily({
    key: "groupPosition",
    get:
        (group: string) =>
        ({ get }) => {
            const groups = get(groupAtom);
            const index = groups.indexOf(group);

            return {
                index,
                first: index === 0,
                last: index === groups.length - 1,
            };
        },
});
