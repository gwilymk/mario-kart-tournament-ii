"use client";

import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import AddPlayerModal from "@/components/AddPlayerModal";
import { PrimaryButton, SecondaryButton } from "@/components/Button";
import CupIcon from "@/components/CupIcon";
import { GroupCollection } from "@/components/Group";
import { useTournament } from "@/components/TournamentContext";
import { Cup, cupForIndex, getNextCup, indexOfCup, isLastCup } from "@/lib/cups";
import css from "./CupSummary.module.css";

interface CupSummaryProps {
    cup: Cup;
}

export const CupSummary: FC<CupSummaryProps> = ({ cup }) => {
    const router = useRouter();

    const { getGroups, completeRound, completedRounds } = useTournament();

    const [isOpen, setIsOpen] = useState(false);

    const currentGroups = useMemo(() => {
        const groups = getGroups();
        return groups[groups.length - 1];
    }, [getGroups]);

    const nextRound = useCallback(() => {
        completeRound();

        if (isLastCup(cup)) {
            router.replace("/tournament/summary");
        } else {
            router.replace(`/tournament/cup/${getNextCup(cup)}`);
        }
    }, [completeRound, cup, router]);

    useEffect(() => {
        if (completedRounds === 0) {
            router.replace("/tournament/player-setup");
        } else if (indexOfCup(cup) !== completedRounds - 1 && !isLastCup(cup)) {
            router.replace(`/tournament/cup/${cupForIndex(completedRounds)}`);
        }
    }, [completedRounds, cup, router]);

    return (
        <>
            <div className={css.title}>
                <CupIcon cup={cup} />
                <h1>Cup</h1>
            </div>
            {currentGroups.length > 0 && <GroupCollection groups={currentGroups} showPlacement={true} />}
            <div className="footer">
                <SecondaryButton onClick={() => setIsOpen(true)}>Add player</SecondaryButton>
                <PrimaryButton onClick={nextRound}>{isLastCup(cup) ? "Finish tournament" : "Next round"}</PrimaryButton>
            </div>
            <AddPlayerModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
};
