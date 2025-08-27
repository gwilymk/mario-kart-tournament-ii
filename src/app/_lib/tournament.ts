import { Player, PlayerId } from "./player";

export class Tournament {
  private rounds: Map<PlayerId, (number | undefined)[]> = new Map();
  private completedRounds: number = 0;

  private players: Player[] = [];

  // also includes historical group sizes for rendering purposes
  private groupSizes: number[][] = [];

  private currentPositions: number[] = [];

  public addPlayer(name: string): Player {
    const playerPositions = [];
    for (let i = 0; i < this.completedRounds; i++) {
      playerPositions.push(undefined);
    }

    const playerId = this.players.length as PlayerId;
    const player = { id: playerId, name, active: true };
    this.players.push(player);

    this.rounds.set(playerId, playerPositions);
    this.currentPositions.push(this.currentPositions.length);

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
          position2! - position1!
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

type Group = {
  players: Player[];
};
