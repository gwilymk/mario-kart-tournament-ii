import { Player, PlayerId } from "./player";

export class Tournament {
    private rounds: Map<PlayerId, (number | undefined)[]> = new Map();
    private completedRounds: number = 0;

    private players: Map<PlayerId, Player> = new Map();

    // also includes historical group sizes for rendering purposes
    private groupSizes: number[][] = [[0]];

    public addPlayer(name: string): Player {
        const playerPositions = [];
        for (let i = 0; i < this.completedRounds; i++) {
            playerPositions.push(undefined);
        }
        playerPositions[this.completedRounds] = this.players.size;

        const playerId = crypto.randomUUID() as PlayerId;
        const player = { id: playerId, name, active: true };
        this.players.set(playerId, player);

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
                        .map(({ playerId }) => this.players.get(playerId))
                        .filter((x) => x !== undefined),
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
            if (oldPosition === this.players.size - 1) {
                return;
            }

            newPosition = oldPosition + 1;
        }

        // find the player with the new position and give them the old position
        const otherPlayer = this.rounds.entries().find(([_, rounds]) => rounds[this.completedRounds] === newPosition);
        if (otherPlayer == null) {
            return;
        }

        otherPlayer[1][this.completedRounds] = oldPosition;
        playerPositions[this.completedRounds] = newPosition;
    }

    public updateGroupSize(groupIndex: number, direction: "up" | "down") {
        const currentGroupSizes = [...this.groupSizes[this.groupSizes.length - 1]];

        if (direction == "up") {
            if (currentGroupSizes.length === 1 || groupIndex === currentGroupSizes.length - 1) {
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

        this.groupSizes[this.groupSizes.length - 1] = currentGroupSizes.filter((groupSize) => groupSize !== 0);
    }

    public completeRound() {
        // for each group, promote the top 2 and demote the bottom 2
        const thisRoundGroupSizes = this.groupSizes[this.groupSizes.length - 1];
        this.groupSizes.push([...thisRoundGroupSizes]);

        const adjustments: number[] = [];

        let groupIndex = 0;
        for (const groupSize of thisRoundGroupSizes) {
            const isFirst = groupIndex == 0;
            const isLast = groupIndex == thisRoundGroupSizes.length - 1;

            const promotionAmount = isFirst ? 0 : groupSize >= 4 ? 2 : isLast ? 2 : 1;
            const demotionAmount = isLast ? 0 : groupSize >= 4 ? 2 : isFirst ? 2 : 1;

            for (let i = 0; i < promotionAmount; i++) {
                adjustments.push(-promotionAmount);
            }

            for (let i = 0; i < groupSize - promotionAmount - demotionAmount; i++) {
                adjustments.push(0);
            }

            for (let i = 0; i < demotionAmount; i++) {
                adjustments.push(demotionAmount);
            }

            groupIndex += 1;
        }

        this.rounds.entries().forEach(([_, positions]) => {
            let currentPosition = positions[positions.length - 1];
            if (currentPosition == null) {
                return;
            }

            positions.push(currentPosition + adjustments[currentPosition]);
        });

        this.completedRounds++;
    }
}

export type Group = {
    players: Player[];
};
