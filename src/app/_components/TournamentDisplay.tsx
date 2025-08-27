import { PlayerId } from "../_lib/player";
import { Group } from "../_lib/tournament";

export default function TournamentDisplay({
  groups,
  movePlayer,
}: Readonly<{
  groups: Group[][];
  movePlayer: (id: PlayerId, direction: "up" | "down") => void;
}>): React.ReactNode {
  return groups.map((roundGroups, groupIndex) => (
    <TournamentRoundDisplay
      groups={roundGroups}
      key={groupIndex}
      cup={groupIndex}
      isCurrent={groups.length - 1 === groupIndex}
      movePlayer={movePlayer}
    />
  ));
}

function TournamentRoundDisplay({
  groups,
  cup,
  isCurrent,
  movePlayer,
}: Readonly<{
  groups: Group[];
  cup: number;
  isCurrent: boolean;
  movePlayer: (id: PlayerId, direction: "up" | "down") => void;
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
}: Readonly<{
  group: Group;
  number: number;
  isCurrent: boolean;
  movePlayer: (id: PlayerId, direction: "up" | "down") => void;
}>): React.ReactNode {
  return (
    <div>
      <h3>Group {number + 1}</h3>
      <ol>
        {group.players.map((player, idx) => (
          <li key={idx}>
            <span>{player.name}</span>
            {isCurrent && (
              <MovePlayerButtons
                onClick={(direction) => movePlayer(player.id, direction)}
              />
            )}
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
