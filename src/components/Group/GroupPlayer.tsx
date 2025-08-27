import { FC } from "react";

import { Player } from "@/lib/player";
import css from "./GroupPlayer.module.css";

interface GroupPlayerProps {
    player: Player;
}

export const GroupPlayer: FC<GroupPlayerProps> = ({ player }) => {
    return <li className={css.player}>{player.name}</li>;
};
