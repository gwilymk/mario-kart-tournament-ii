import React, { FC } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import { IconButton } from "@/components/Button";
import { GroupPlayer } from "@/components/Group/GroupPlayer";
import { useTournament } from "@/components/TournamentContext";
import { Group as PlayerGroup } from "@/lib/tournament";
import css from "./Group.module.css";

interface GroupProps {
    group: PlayerGroup;
    number: number;
    showPlacement?: boolean;
}

export const Group: FC<GroupProps> = ({ group, number, showPlacement }) => {
    const { updateGroupSize } = useTournament();

    const groupIndex = (number % 5) + 1;

    return (
        <div
            className={css.group}
            style={{
                backgroundColor: `var(--group-${groupIndex}-color)`,
                borderColor: `var(--group-${groupIndex}-color-light)`,
            }}
        >
            <div className={css.header}>
                <IconButton type="button" onClick={() => updateGroupSize(number, "down")} className={css.icon}>
                    <RemoveCircleOutlineIcon />
                </IconButton>
                <h2 className={css.title}>Group {number + 1}</h2>

                <IconButton type="button" onClick={() => updateGroupSize(number, "up")} className={css.icon}>
                    <AddCircleOutlineIcon />
                </IconButton>
            </div>
            <ol className={css.players}>
                {group.players.map((player) => (
                    <GroupPlayer player={player} key={player.id} showPlacement={showPlacement} />
                ))}
            </ol>
        </div>
    );
};
