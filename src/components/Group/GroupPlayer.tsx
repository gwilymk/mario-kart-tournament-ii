import React, { FC } from "react";
import Delete from "@mui/icons-material/Delete";
import classNames from "classnames";

import { IconButton } from "@/components/Button";
import { useTournament } from "@/components/TournamentContext";
import { Player } from "@/lib/player";
import css from "./GroupPlayer.module.css";

interface GroupPlayerProps {
    player: Player;
    showPlacement?: boolean;
}

export const GroupPlayer: FC<GroupPlayerProps> = ({ player, showPlacement }) => {
    const { removePlayer } = useTournament();

    return (
        <li className={classNames(css.player, { [css.placement]: showPlacement })}>
            <span className={css.name}>{player.name}</span>
            <IconButton type="button" onClick={() => removePlayer(player.id)} className={css.icon}>
                <Delete />
            </IconButton>
        </li>
    );
};
