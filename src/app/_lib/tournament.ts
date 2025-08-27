import { Player, PlayerId } from "./player";

export class Tournament {
  private rounds: Map<PlayerId, (number | undefined)[]> = new Map();
  private completedRounds: number = 0;

  private players: Player[] = [];

  // also includes historical group sizes for rendering purposes
  private groupSizes: number[][] = [[0]];

  private currentPositions: number[] = [];

  public addPlayer(name: string): Player {
    const playerPositions = [];
    for (let i = 0; i < this.completedRounds; i++) {
      playerPositions.push(undefined);
    }
    playerPositions[this.completedRounds] = this.players.length - 1;

    const playerId = this.players.length as PlayerId;
    const player = { id: playerId, name, active: true };
    this.players.push(player);

    this.rounds.set(playerId, playerPositions);
    this.currentPositions.push(this.currentPositions.length);

    const currentGroup = this.groupSizes[this.groupSizes.length - 1];
    currentGroup[currentGroup.length - 1] += 1;

    return player;
  }

  public getGroups(): Group[][] {
    const ret = [];

    let roundNumber = 0;
    for (const roundGroupSizes of this.groupSizes) {
      const playersAndPositions = Array.from(
        this.rounds
          .entries()
          .map(([playerId, maybePosition]) => ({
            playerId,
            position: maybePosition[roundNumber],
          }))
          .filter(({ position }) => position != null)
      );

      playersAndPositions.sort(
        ({ position: position1 }, { position: position2 }) =>
          // can't be undefined because of the filter above
          position1! - position2!
      );

      const thisGroup = [];
      for (const roundGroupSize of roundGroupSizes) {
        thisGroup.push({
          players: playersAndPositions
            .splice(0, roundGroupSize)
            .map(({ playerId }) => this.players[playerId]),
        });
      }

      ret.push(thisGroup);

      roundNumber++;
    }

    return ret;
  }
}

export type Group = {
  players: Player[];
};
