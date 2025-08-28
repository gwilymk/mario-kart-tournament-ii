import { FC } from "react";

import { Group } from "@/components/Group/Group";
import { Group as PlayerGroup } from "@/lib/tournament";
import css from "./GroupCollection.module.css";

interface GroupCollectionProps {
    groups: PlayerGroup[];
    showPlacement?: boolean;
}

export const GroupCollection: FC<GroupCollectionProps> = ({ groups, showPlacement }) => {
    return (
        <div className={css.collection}>
            {groups.map((group, index) => (
                <Group key={index} number={index} group={group} showPlacement={showPlacement} />
            ))}
        </div>
    );
};
