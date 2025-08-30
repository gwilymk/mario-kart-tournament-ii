import React, { FC } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import { IconButton } from "@/components/Button";
import { GroupPlayer } from "@/components/GroupPlayer";
import { MAXIMUM_GROUP_SIZE, MINIMUM_GROUP_SIZE, useTournament } from "@/components/TournamentContext";
import { PlayerGroup } from "@/lib/player";
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
                <IconButton
                    type="button"
                    onClick={() => updateGroupSize(number, "down")}
                    className={css.icon}
                    disabled={group.players.length <= MINIMUM_GROUP_SIZE}
                >
                    <RemoveCircleOutlineIcon />
                </IconButton>
                <h2 className={css.title}>Group {number + 1}</h2>
                <IconButton
                    type="button"
                    onClick={() => updateGroupSize(number, "up")}
                    className={css.icon}
                    disabled={group.players.length === MAXIMUM_GROUP_SIZE}
                >
                    <AddCircleOutlineIcon />
                </IconButton>
            </div>
            <ol className={css.players}>
                {group.players.map((player, index) => (
                    <GroupPlayer
                        player={player}
                        key={player.id}
                        showPlacement={showPlacement}
                        showControls={true}
                        index={index}
                    />
                ))}
            </ol>
        </div>
    );
};
