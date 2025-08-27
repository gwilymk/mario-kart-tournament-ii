import { Group } from "../_lib/tournament";

export default function TournamentDisplay({
  groups,
}: Readonly<{ groups: Group[][] }>): React.ReactNode {
  return groups.map((roundGroups, groupIndex) => (
    <TournamentRoundDisplay
      groups={roundGroups}
      key={groupIndex}
      cup={groupIndex}
    />
  ));
}

function TournamentRoundDisplay({
  groups,
  cup,
}: Readonly<{ groups: Group[]; cup: number }>): React.ReactNode {
  return (
    <div>
      <h2>Cup {cup}</h2>
      {groups.map((group, groupNumber) => (
        <GroupDisplay group={group} number={groupNumber} key={groupNumber} />
      ))}
    </div>
  );
}

function GroupDisplay({
  group,
  number,
}: Readonly<{ group: Group; number: number }>): React.ReactNode {
  return (
    <div>
      <h3>Group {number + 1}</h3>
      <ol>
        {group.players.map((player, idx) => (
          <li key={idx}>{player.name}</li>
        ))}
      </ol>
    </div>
  );
}
