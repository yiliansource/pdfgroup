import { atomFamily } from "recoil";

import { Page } from "../pdf/page";

export const pageAtom = atomFamily<Page, string>({
    key: "page",
    default: null!,
    dangerouslyAllowMutability: true,
});
