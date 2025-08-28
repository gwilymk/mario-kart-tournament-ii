"use client";

import { useMemo } from "react";

import { PrimaryButton } from "@/components/Button";
import { GroupCollection } from "@/components/Group";
import PlayerNameInput from "@/components/PlayerNameInput";
import { useTournament } from "@/components/TournamentContext";

export default function AddPlayers() {
    const { addPlayer, getGroups, completeRound } = useTournament();

    const groups = useMemo(getGroups, [getGroups]);

    return (
        <>
            <h1>Player Setup</h1>
            <PlayerNameInput onSubmit={addPlayer} />
            <GroupCollection groups={groups[groups.length - 1]} showPlacement={true} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "end" }}>
                <PrimaryButton onClick={completeRound}>Start Tournament</PrimaryButton>
            </div>
        </>
    );
}
