"use client";

import { createContext, FC, PropsWithChildren, useCallback, useContext, useMemo } from "react";

import { useLocalStorageImmer, useLocalStorageState } from "@/lib/hooks/useLocalStorage";
import { Player, PlayerGroup, PlayerId } from "@/lib/player";

const isDefined = <T,>(x: T | undefined | null): x is T => x !== undefined && x !== null;

interface Tournament {
    hasLoaded: boolean;
    addPlayer: (name: string) => Player;
    removePlayer: (playerId: PlayerId) => void;
    getGroups: () => PlayerGroup[][];
    movePlayer: (playerId: PlayerId, direction: "up" | "down") => void;
    updateGroupSize: (groupIndex: number, direction: "up" | "down") => void;
    completeRound: () => void;
    canStart: boolean;
    completedRounds: number;
    summary: { player: Player; positions: (number | undefined)[] }[];
    reset: () => void;
}

const TournamentContext = createContext<Tournament>({
    hasLoaded: undefined!,
    addPlayer: undefined!,
    removePlayer: undefined!,
    getGroups: undefined!,
    movePlayer: undefined!,
    updateGroupSize: undefined!,
    completeRound: undefined!,
    canStart: undefined!,
    completedRounds: undefined!,
    summary: undefined!,
    reset: undefined!,
});

export const MAXIMUM_GROUP_SIZE = 8;
export const MINIMUM_GROUP_SIZE = 3;

export const useTournament = () => useContext(TournamentContext);

export const TournamentProvider: FC<PropsWithChildren> = ({ children }) => {
    const [rounds, setRounds, hasLoadedRounds] = useLocalStorageImmer<Map<PlayerId, (number | undefined)[]>>(
        "rounds",
        new Map()
    );
    const [completedRounds, setCompletedRounds, hasLoadedCompletedRounds] = useLocalStorageState("completedRounds", 0);
    const [players, setPlayers, hasLoadedPlayers] = useLocalStorageImmer<Map<PlayerId, Player>>("players", new Map());
    // also includes historical group sizes for rendering purposes
    const [groupSizes, setGroupSizes, hasLoadedGroupSizes] = useLocalStorageImmer("groupSizes", [[0]]);

    const hasLoaded = useMemo(
        () => hasLoadedRounds && hasLoadedCompletedRounds && hasLoadedPlayers && hasLoadedGroupSizes,
        [hasLoadedCompletedRounds, hasLoadedGroupSizes, hasLoadedPlayers, hasLoadedRounds]
    );

    const addPlayer = useCallback(
        (name: string): Player => {
            const playerPositions: (number | undefined)[] = [];

            for (let i = 0; i < completedRounds; i++) {
                playerPositions.push(undefined);
            }

            playerPositions[completedRounds] = players.size;

            const playerId = crypto.randomUUID() as PlayerId;
            const player = { id: playerId, name, active: true };

            setPlayers((currentValue) => {
                currentValue.set(playerId, player);
            });

            setRounds((currentValue) => {
                currentValue.set(playerId, playerPositions);
            });

            setGroupSizes((currentValue) => {
                const currentGroupSizes = currentValue[currentValue.length - 1];
                const currentGroupSize = currentGroupSizes[currentGroupSizes.length - 1];

                if (currentGroupSize === MAXIMUM_GROUP_SIZE) {
                    currentGroupSizes.push(1);
                } else {
                    currentGroupSizes[currentGroupSizes.length - 1]++;
                }
            });

            return player;
        },
        [completedRounds, players.size, setGroupSizes, setPlayers, setRounds]
    );

    const removePlayer = useCallback(
        (playerId: PlayerId) => {
            const playerPositions = rounds.get(playerId);
            if (playerPositions === undefined) {
                return;
            }

            // If we haven't started yet, delete the player
            if (playerPositions.length === 1) {
                setRounds((currentValue) => {
                    currentValue.delete(playerId);
                });
                setPlayers((currentValue) => {
                    currentValue.delete(playerId);
                });
            } else {
                setPlayers((currentValue) => {
                    const player = currentValue.get(playerId);
                    if (player) {
                        player.active = false;
                    }
                });
            }
            setGroupSizes((currentValue) => {
                const currentGroupSizes = [...currentValue[currentValue.length - 1]];
                currentGroupSizes[currentGroupSizes.length - 1]--;

                const newSizes = currentGroupSizes.filter((groupSize) => groupSize > 0);

                currentValue[currentValue.length - 1] = newSizes.length > 0 ? newSizes : [0];
            });
        },
        [rounds, setGroupSizes, setPlayers, setRounds]
    );

    const getGroups = useCallback(() => {
        const ret = [];

        let roundNumber = 0;
        for (const roundGroupSizes of groupSizes) {
            const playersAndPositions = Array.from(
                Array.from(rounds.entries())
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

            const thisGroup: PlayerGroup[] = [];
            for (const roundGroupSize of roundGroupSizes) {
                thisGroup.push({
                    players: playersAndPositions
                        .splice(0, roundGroupSize)
                        .map(({ playerId }) => players.get(playerId))
                        .filter((x) => x !== undefined),
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
                const playerPositions = rounds.get(playerId);

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
                    if (oldPosition === players.size - 1) {
                        return;
                    }

                    newPosition = oldPosition + 1;
                }

                // find the player with the new position and give them the old position
                const otherPlayer = Array.from(rounds.values()).find(
                    (rounds) => rounds[completedRounds] === newPosition
                );

                if (otherPlayer == null) {
                    return;
                }

                otherPlayer[completedRounds] = oldPosition;
                playerPositions[completedRounds] = newPosition;
            });
        },
        [completedRounds, players.size, setRounds]
    );

    const updateGroupSize = useCallback(
        (groupIndex: number, direction: "up" | "down") => {
            setGroupSizes((currentValue) => {
                const currentGroupSizes = [...currentValue[currentValue.length - 1]];

                if (direction == "up") {
                    if (currentGroupSizes.length === 1 || groupIndex === currentGroupSizes.length - 1) {
                        return;
                    }

                    const currentGroupSize = currentGroupSizes[groupIndex];
                    if (currentGroupSize === MAXIMUM_GROUP_SIZE) {
                        return;
                    }

                    currentGroupSizes[groupIndex]++;
                    currentGroupSizes[groupIndex + 1]--;
                } else {
                    if (currentGroupSizes[groupIndex] === 0) {
                        return;
                    }

                    const currentGroupSize = currentGroupSizes[groupIndex];
                    if (currentGroupSize === MINIMUM_GROUP_SIZE) {
                        return;
                    }

                    if (groupIndex === currentGroupSizes.length - 1) {
                        currentGroupSizes.push(1);
                        currentGroupSizes[groupIndex]--;
                    } else {
                        const nextGroupSize = currentGroupSizes[groupIndex + 1];
                        if (nextGroupSize === MAXIMUM_GROUP_SIZE) {
                            return;
                        }

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
        setGroupSizes((currentValue) => {
            currentValue.push([...thisRoundGroupSizes]);
        });

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

        setRounds((currentValue) => {
            for (const [playerId, positions] of currentValue.entries()) {
                const player = players.get(playerId);

                if (!player || !player.active) {
                    return;
                }

                const currentPosition = positions[positions.length - 1];
                if (currentPosition == null) {
                    return;
                }

                positions.push(currentPosition + adjustments[currentPosition]);
            }
        });

        setCompletedRounds(completedRounds + 1);
    }, [completedRounds, groupSizes, players, setCompletedRounds, setGroupSizes, setRounds]);

    const canStart = useMemo(() => Array.from(players).some((x) => x[1].active), [players]);

    const summary = useMemo(
        () =>
            Array.from(rounds.entries())
                .map(([playerId, positions]) => {
                    const player = players.get(playerId);

                    if (!player) {
                        return;
                    }

                    return { player, positions };
                })
                .filter((x) => x !== undefined)
                .sort((a, b) => {
                    if (a === undefined) {
                        return -1;
                    }
                    if (b === undefined) {
                        return 1;
                    }

                    for (let round = 0; round < a.positions.length; round++) {
                        const positionA = a.positions[round];
                        const positionB = b.positions[round];

                        if (isDefined(positionA) && isDefined(positionB)) {
                            return positionA - positionB;
                        } else if (!isDefined(positionA) && isDefined(positionB)) {
                            return 1;
                        } else if (!isDefined(positionB) && isDefined(positionA)) {
                            return -1;
                        }
                    }

                    return a.player.name.localeCompare(b.player.name);
                }),
        [players, rounds]
    );

    const reset = useCallback(() => {
        setRounds(new Map());
        setCompletedRounds(0);
        setPlayers(new Map());
        setGroupSizes([[0]]);
    }, [setCompletedRounds, setGroupSizes, setPlayers, setRounds]);

    const value = useMemo(
        () => ({
            hasLoaded,
            addPlayer,
            removePlayer,
            getGroups,
            movePlayer,
            updateGroupSize,
            completeRound,
            canStart,
            completedRounds,
            summary,
            reset,
        }),
        [
            addPlayer,
            canStart,
            completeRound,
            completedRounds,
            getGroups,
            hasLoaded,
            movePlayer,
            removePlayer,
            reset,
            summary,
            updateGroupSize,
        ]
    );

    return <TournamentContext.Provider value={value}>{children}</TournamentContext.Provider>;
};
