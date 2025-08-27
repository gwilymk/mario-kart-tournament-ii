import { FC } from "react";

import { GroupPlayer } from "@/components/Group/GroupPlayer";
import { Group as PlayerGroup } from "@/lib/tournament";
import css from "./Group.module.css";

interface GroupProps {
    group: PlayerGroup;
    number: number;
}

export const Group: FC<GroupProps> = ({ group, number }) => {
    const groupIndex = (number % 5) + 1;

    return (
        <div
            className={css.group}
            style={{
                backgroundColor: `var(--group-${groupIndex}-color)`,
                borderColor: `var(--group-${groupIndex}-color-light)`,
            }}
        >
            <h2 className={css.title}>Group {number + 1}</h2>
            <ol className={css.players}>
                {group.players.map((player) => (
                    <GroupPlayer player={player} key={player.id} />
                ))}
            </ol>
        </div>
    );
};
