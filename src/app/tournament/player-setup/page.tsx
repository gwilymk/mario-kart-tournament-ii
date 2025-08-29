"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

import { PrimaryButton } from "@/components/Button";
import { GroupCollection } from "@/components/Group";
import PlayerNameInput from "@/components/PlayerNameInput";
import { useTournament } from "@/components/TournamentContext";
import { firstCup } from "@/lib/cups";

export default function AddPlayers() {
    const { addPlayer, getGroups } = useTournament();
    const router = useRouter();

    const currentGroups = useMemo(() => {
        const groups = getGroups();
        return groups[groups.length - 1];
    }, [getGroups]);

    return (
        <>
            <h1>Player Setup</h1>
            <PlayerNameInput onSubmit={addPlayer} />
            {currentGroups.length > 0 && <GroupCollection groups={currentGroups} />}
            <div className="footer">
                <PrimaryButton onClick={() => router.push(`/tournament/cup/${firstCup}`)}>
                    Start Tournament
                </PrimaryButton>
            </div>
        </>
    );
}
