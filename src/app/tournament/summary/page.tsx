"use client";

import { useRouter } from "next/navigation";

import { SecondaryButton } from "@/components/Button";
import { useTournament } from "@/components/TournamentContext";
import { TournamentSummary } from "@/components/TournamentSummary";

export default function Summary() {
    const router = useRouter();
    const { reset } = useTournament();

    const resetTournament = () => {
        reset();
        router.replace("/tournament/player-setup");
    };

    return (
        <>
            <TournamentSummary />
            <div className="footer">
                <SecondaryButton type="button" onClick={resetTournament}>
                    Reset tournament
                </SecondaryButton>
            </div>
        </>
    );
}
