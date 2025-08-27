import { FC } from "react";
import classNames from "classnames";

import { Player } from "@/lib/player";
import css from "./GroupPlayer.module.css";

interface GroupPlayerProps {
    player: Player;
    showPlacement?: boolean;
}

export const GroupPlayer: FC<GroupPlayerProps> = ({ player, showPlacement }) => {
    return <li className={classNames(css.player, { [css.placement]: showPlacement })}>{player.name}</li>;
};
