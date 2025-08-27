import { Player, PlayerId } from "./player";

export class Tournament {
  private rounds: Map<PlayerId, (number | undefined)[]> = new Map();
  private completedRounds: number = 0;

  private players: Player[] = [];

  // also includes historical group sizes for rendering purposes
  private groupSizes: number[][] = [[0]];

  public addPlayer(name: string): Player {
    const playerPositions = [];
    for (let i = 0; i < this.completedRounds; i++) {
      playerPositions.push(undefined);
    }
    playerPositions[this.completedRounds] = this.players.length;

    const playerId = this.players.length as PlayerId;
    const player = { id: playerId, name, active: true };
    this.players.push(player);

    this.rounds.set(playerId, playerPositions);

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

  public movePlayer(playerId: PlayerId, direction: "up" | "down") {
    const playerPositions = this.rounds.get(playerId);
    if (playerPositions == null) {
      return;
    }

    const oldPosition = playerPositions[this.completedRounds];
    if (oldPosition == null) {
      return;
    }

    let newPosition;
    if (direction === "up") {
      if (oldPosition === 0) {
        return;
      }

      newPosition = oldPosition - 1;
    } else {
      if (oldPosition === this.players.length - 1) {
        return;
      }

      newPosition = oldPosition + 1;
    }

    // find the player with the new position and give them the old position
    const otherPlayer = this.rounds
      .entries()
      .find(([_, rounds]) => rounds[this.completedRounds] === newPosition);
    if (otherPlayer == null) {
      return;
    }

    otherPlayer[1][this.completedRounds] = oldPosition;
    playerPositions[this.completedRounds] = newPosition;
  }

  public updateGroupSize(groupIndex: number, direction: "up" | "down") {
    const currentGroupSizes = [...this.groupSizes[this.groupSizes.length - 1]];

    if (direction == "up") {
      if (
        currentGroupSizes.length === 1 ||
        groupIndex === currentGroupSizes.length - 1
      ) {
        return;
      }

      currentGroupSizes[groupIndex]++;
      currentGroupSizes[groupIndex + 1]--;
    } else {
      if (currentGroupSizes[groupIndex] === 0) {
        return;
      }

      if (groupIndex === currentGroupSizes.length - 1) {
        currentGroupSizes.push(1);
        currentGroupSizes[groupIndex]--;
      } else {
        currentGroupSizes[groupIndex]--;
        currentGroupSizes[groupIndex + 1]++;
      }
    }

    this.groupSizes[this.groupSizes.length - 1] = currentGroupSizes.filter(
      (groupSize) => groupSize !== 0
    );
  }
}

export type Group = {
  players: Player[];
};
