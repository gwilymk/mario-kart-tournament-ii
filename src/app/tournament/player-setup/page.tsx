"use client";

import { useMemo } from "react";

import { PrimaryButton } from "@/components/Button";
import { GroupCollection } from "@/components/Group";
import PlayerNameInput from "@/components/PlayerNameInput";
import { useTournament } from "@/components/TournamentContext";

export default function AddPlayers() {
    const { addPlayer, getGroups, completeRound } = useTournament();

    const currentGroups = useMemo(() => {
        const groups = getGroups();
        return groups[groups.length - 1];
    }, [getGroups]);

    return (
        <>
            <h1>Player Setup</h1>
            <PlayerNameInput onSubmit={addPlayer} />
            {currentGroups.length > 0 && <GroupCollection groups={currentGroups} showPlacement={true} />}
            <div className="footer">
                <PrimaryButton onClick={completeRound}>Start Tournament</PrimaryButton>
            </div>
        </>
    );
}
