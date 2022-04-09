import { atom } from "recoil";

export const inspectedPageAtom = atom<string | null>({
    key: "selectedPage",
    default: null,
});
