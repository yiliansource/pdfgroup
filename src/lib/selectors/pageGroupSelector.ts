import { selectorFamily } from "recoil";

import { groupAtom } from "../atoms/groupAtom";
import { groupPagesAtom } from "../atoms/groupPagesAtom";

export const pageGroupSelector = selectorFamily({
    key: "pageGroup",
    get:
        (page: string) =>
        ({ get }) => {
            for (const group of get(groupAtom)) {
                if (get(groupPagesAtom(group)).includes(page)) {
                    return group;
                }
            }
            throw new Error();
        },
});
