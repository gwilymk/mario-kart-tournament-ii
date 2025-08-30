"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

import { PrimaryButton } from "@/components/Button";
import { GroupCollection } from "@/components/Group";
import PlayerNameInput from "@/components/PlayerNameInput";
import { useTournament } from "@/components/TournamentContext";
import { firstCup } from "@/lib/cups";

export default function AddPlayers() {
    const { getGroups, canStart } = useTournament();
    const router = useRouter();

    const currentGroups = useMemo(() => {
        const groups = getGroups();
        return groups[groups.length - 1];
    }, [getGroups]);

    return (
        <>
            <h1>Player Setup</h1>
            <PlayerNameInput />
            {currentGroups.length > 0 && currentGroups[0].players.length > 0 && (
                <GroupCollection groups={currentGroups} />
            )}
            <div className="footer">
                <PrimaryButton onClick={() => router.replace(`/tournament/cup/${firstCup}`)} disabled={!canStart}>
                    Start Tournament
                </PrimaryButton>
            </div>
        </>
    );
}
