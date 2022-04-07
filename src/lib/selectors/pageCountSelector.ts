import { selectorFamily } from "recoil";

import { groupPagesAtom } from "../atoms/groupPagesAtom";

export const pageCountSelector = selectorFamily<number, string>({
    key: "pageCount",
    get:
        (group) =>
        ({ get }) => {
            return get(groupPagesAtom(group)).length;
        },
});
