import { PlayerId } from "../app/_lib/player";
import { Group } from "../app/_lib/tournament";
import css from "./TournamentDisplay.module.css";

export default function TournamentDisplay({
    groups,
    movePlayer,
    updateGroupSize,
    completeRound,
}: Readonly<{
    groups: Group[][];
    movePlayer: (id: PlayerId, direction: "up" | "down") => void;
    updateGroupSize: (id: number, direction: "up" | "down") => void;
    completeRound: () => void;
}>): React.ReactNode {
    return (
        <div>
            <div className={css.groups}>
                {groups.map((roundGroups, groupIndex) => (
                    <TournamentRoundDisplay
                        groups={roundGroups}
                        key={groupIndex}
                        cup={groupIndex}
                        isCurrent={groups.length - 1 === groupIndex}
                        movePlayer={movePlayer}
                        updateGroupSize={updateGroupSize}
                    />
                ))}
            </div>

            <button onClick={() => completeRound()}>Complete round</button>
        </div>
    );
}

function TournamentRoundDisplay({
    groups,
    cup,
    isCurrent,
    movePlayer,
    updateGroupSize,
}: Readonly<{
    groups: Group[];
    cup: number;
    isCurrent: boolean;
    movePlayer: (id: PlayerId, direction: "up" | "down") => void;
    updateGroupSize: (id: number, direction: "up" | "down") => void;
}>): React.ReactNode {
    return (
        <div>
            <h2>Cup {cup}</h2>
            {groups.map((group, groupNumber) => (
                <GroupDisplay
                    group={group}
                    number={groupNumber}
                    key={groupNumber}
                    isCurrent={isCurrent}
                    movePlayer={movePlayer}
                    updateGroupSize={updateGroupSize}
                />
            ))}
        </div>
    );
}

function GroupDisplay({
    group,
    number,
    isCurrent,
    movePlayer,
    updateGroupSize,
}: Readonly<{
    group: Group;
    number: number;
    isCurrent: boolean;
    movePlayer: (id: PlayerId, direction: "up" | "down") => void;
    updateGroupSize: (id: number, direction: "up" | "down") => void;
}>): React.ReactNode {
    return (
        <div>
            <div className={css.groupHeader}>
                <h3>Group {number + 1}</h3>{" "}
                {isCurrent && <UpdateGroupSize onClick={(direction) => updateGroupSize(number, direction)} />}
            </div>

            <ol className={css.player}>
                {group.players.map((player, idx) => (
                    <li key={idx}>
                        <div className={css.playerAndPosition}>
                            <span>{idx + 1}</span>
                            <span>{player.name}</span>
                        </div>
                        {isCurrent && <MovePlayerButtons onClick={(direction) => movePlayer(player.id, direction)} />}
                    </li>
                ))}
            </ol>
        </div>
    );
}

function MovePlayerButtons({
    onClick,
}: Readonly<{
    onClick: (direction: "up" | "down") => void;
}>): React.ReactNode {
    return (
        <div>
            <button onClick={() => onClick("up")}>Up</button>
            <button onClick={() => onClick("down")}>Down</button>
        </div>
    );
}

function UpdateGroupSize({
    onClick,
}: Readonly<{
    onClick: (direction: "up" | "down") => void;
}>): React.ReactNode {
    return (
        <div>
            <button onClick={() => onClick("up")}>Up</button>
            <button onClick={() => onClick("down")}>Down</button>
        </div>
    );
}
