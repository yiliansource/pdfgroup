import { atom } from "recoil";

export const isImportingAtom = atom<boolean>({
    key: "isImporting",
    default: false,
});
