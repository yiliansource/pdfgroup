import { atomFamily } from "recoil";
import { v4 as uuidv4 } from "uuid";

export const groupPagesAtom = atomFamily<Array<string>, string>({
    key: "group",
    default: () => [],
});
