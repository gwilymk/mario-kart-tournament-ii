"use client";

import { createContext, FC, PropsWithChildren, useCallback, useContext, useMemo } from "react";

import { useLocalStorageImmer, useLocalStorageState } from "@/lib/hooks/useLocalStorage";
import { Player, PlayerId } from "@/lib/player";
import { Group } from "@/lib/tournament";

interface Tournament {
    addPlayer: (name: string) => Player;
    getGroups: () => Group[][];
    movePlayer: (playerId: PlayerId, direction: "up" | "down") => void;
    updateGroupSize: (groupIndex: number, direction: "up" | "down") => void;
    completeRound: () => void;
}

const TournamentContext = createContext<Tournament>({
    addPlayer: undefined!,
    getGroups: undefined!,
    movePlayer: undefined!,
    updateGroupSize: undefined!,
    completeRound: undefined!,
});

export const useTournament = () => useContext(TournamentContext);

export const TournamentProvider: FC<PropsWithChildren> = ({ children }) => {
    const [rounds, setRounds] = useLocalStorageImmer<Record<PlayerId, (number | undefined)[]>>("rounds", {});
    const [completedRounds, setCompletedRounds] = useLocalStorageState("completedRounds", 0);
    const [players, setPlayers] = useLocalStorageImmer<Player[]>("players", []);
    // also includes historical group sizes for rendering purposes
    const [groupSizes, setGroupSizes] = useLocalStorageImmer("groupSizes", [[0]]);

    const addPlayer = useCallback(
        (name: string): Player => {
            const playerPositions: (number | undefined)[] = [];

            for (let i = 0; i < completedRounds; i++) {
                playerPositions.push(undefined);
            }

            playerPositions[completedRounds] = players.length;

            const playerId = players.length as PlayerId;
            const player = { id: playerId, name, active: true };

            setPlayers((currentValue) => {
                currentValue.push(player);
            });

            setRounds((currentValue) => {
                currentValue[playerId] = playerPositions;
            });

            setGroupSizes((currentValue) => {
                const currentGroup = currentValue[groupSizes.length - 1];

                currentGroup[groupSizes.length - 1] += 1;
            });

            return player;
        },
        [completedRounds, groupSizes.length, players.length, setGroupSizes, setPlayers, setRounds]
    );

    const getGroups = useCallback(() => {
        const ret = [];

        let roundNumber = 0;
        for (const roundGroupSizes of groupSizes) {
            const playersAndPositions = Array.from(
                Object.entries(rounds)
                    .map(([playerId, maybePosition]) => ({
                        playerId: Number(playerId) as PlayerId,
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
                    players: playersAndPositions.splice(0, roundGroupSize).map(({ playerId }) => players[playerId]),
                });
            }

            ret.push(thisGroup);

            roundNumber++;
        }

        return ret;
    }, [groupSizes, players, rounds]);

    const movePlayer = useCallback(
        (playerId: PlayerId, direction: "up" | "down") => {
            setRounds((rounds) => {
                const playerPositions = rounds[playerId];

                if (playerPositions == null) {
                    return;
                }

                const oldPosition = playerPositions[completedRounds];
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
                    if (oldPosition === players.length - 1) {
                        return;
                    }

                    newPosition = oldPosition + 1;
                }

                // find the player with the new position and give them the old position
                const otherPlayer = Object.entries(rounds).find(
                    ([_, rounds]) => rounds[completedRounds] === newPosition
                );

                if (otherPlayer == null) {
                    return;
                }

                otherPlayer[1][completedRounds] = oldPosition;
                playerPositions[completedRounds] = newPosition;
            });
        },
        [completedRounds, players.length, setRounds]
    );

    const updateGroupSize = useCallback(
        (groupIndex: number, direction: "up" | "down") => {
            setGroupSizes((currentValue) => {
                const currentGroupSizes = [...currentValue[currentValue.length - 1]];

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

                currentValue[currentValue.length - 1] = currentGroupSizes.filter((groupSize) => groupSize !== 0);
            });
        },
        [setGroupSizes]
    );

    const completeRound = useCallback(() => {
        // for each group, promote the top 2 and demote the bottom 2
        const thisRoundGroupSizes = groupSizes[groupSizes.length - 1];
        setGroupSizes((currentValue) => currentValue.push([...thisRoundGroupSizes]));

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

        setRounds((currentValue) =>
            Object.entries(currentValue).forEach(([_, positions]) => {
                const currentPosition = positions[positions.length - 1];
                if (currentPosition == null) {
                    return;
                }

                positions.push(currentPosition + adjustments[currentPosition]);
            })
        );

        setCompletedRounds((currentValue) => currentValue++);
    }, [groupSizes, setCompletedRounds, setGroupSizes, setRounds]);

    const value = useMemo(
        () => ({
            addPlayer,
            getGroups,
            movePlayer,
            updateGroupSize,
            completeRound,
        }),
        [addPlayer, completeRound, getGroups, movePlayer, updateGroupSize]
    );

    return <TournamentContext.Provider value={value}>{children}</TournamentContext.Provider>;
};
