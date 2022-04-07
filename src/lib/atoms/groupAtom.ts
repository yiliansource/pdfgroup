import { atom } from "recoil";

export const groupAtom = atom<Array<string>>({
    key: "group",
    default: [],
});
