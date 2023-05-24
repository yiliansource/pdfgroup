import { atomFamily } from "recoil";

export const groupNameAtom = atomFamily<string, string>({
    key: "groupName",
    default: "",
});
