import React, { FC } from "react";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Delete from "@mui/icons-material/Delete";
import classNames from "classnames";

import { IconButton } from "@/components/Button";
import { useTournament } from "@/components/TournamentContext";
import { Player } from "@/lib/player";
import { getImageUrl } from "@/lib/prefix";
import css from "./GroupPlayer.module.css";

interface GroupPlayerProps {
    player: Player;
    index?: number;
    showPlacement?: boolean;
    showControls?: boolean;
}

export const GroupPlayer: FC<GroupPlayerProps> = ({ player, index, showPlacement, showControls }) => {
    const { removePlayer, movePlayer } = useTournament();

    const backgroundImage =
        index !== undefined && showPlacement
            ? `url(\"${getImageUrl(`/images/placement/placement-${index + 1}.webp`)}\")`
            : undefined;

    return (
        <li className={classNames(css.player, { [css.placement]: showPlacement })} style={{ backgroundImage }}>
            <span className={css.name}>{player.name}</span>
            {showControls && (
                <>
                    <IconButton type="button" onClick={() => movePlayer(player.id, "up")} className={css.icon}>
                        <ArrowUpwardIcon />
                    </IconButton>
                    <IconButton type="button" onClick={() => movePlayer(player.id, "down")} className={css.icon}>
                        <ArrowDownwardIcon />
                    </IconButton>
                    <IconButton type="button" onClick={() => {
                        if (confirm(`Are you sure you want to remove ${player.name} from the tournament?`)) {
                            removePlayer(player.id);
                        }
                    } className={css.icon}>
                        <Delete />
                    </IconButton>
                </>
            )}
        </li>
    );
};
