import { Box, Collapse } from "@mui/material";
import { TransitionGroup } from "react-transition-group";
import { useRecoilValue } from "recoil";

import { groupAtom } from "src/lib/atoms/groupAtom";

import { GroupView } from "./GroupView";

export function GroupList() {
    const groups = useRecoilValue(groupAtom);

    return (
        <TransitionGroup>
            {groups.map((group) => (
                <Collapse key={group}>
                    <Box mb={1}>
                        <GroupView group={group} />
                    </Box>
                </Collapse>
            ))}
        </TransitionGroup>
    );
}
