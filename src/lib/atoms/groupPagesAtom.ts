import { atomFamily } from "recoil";

export const groupPagesAtom = atomFamily<Array<string>, string>({
    key: "group",
    default: () => [],
});
