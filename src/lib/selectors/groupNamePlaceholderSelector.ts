import { selectorFamily } from "recoil";

import { settingsAtom } from "../atoms/settingsAtom";
import { groupPositionSelector } from "./groupPositionSelector";
import { pageCountSelector } from "./pageCountSelector";

export const groupNamePlaceholderSelector = selectorFamily<string, string>({
    key: "groupNamePlaceholder",
    get:
        (group: string) =>
        ({ get }) => {
            const { preferences } = get(settingsAtom);
            const pageCount = get(pageCountSelector(group));
            const groupPosition = get(groupPositionSelector(group));

            return preferences.defaultGroupName
                .replace("{index}", (groupPosition.index + 1).toString())
                .replace("{count}", pageCount.toString());
        },
});
