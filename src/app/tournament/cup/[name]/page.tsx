"use client";

import { use, useCallback, useEffect, useMemo, useState } from "react";
import { notFound, useRouter } from "next/navigation";

import AddPlayerModal from "@/components/AddPlayerModal";
import { PrimaryButton, SecondaryButton } from "@/components/Button";
import { GroupCollection } from "@/components/Group";
import { useTournament } from "@/components/TournamentContext";
import { cupForIndex, getNextCup, indexOfCup, isCup, isLastCup } from "@/lib/cups";
import css from "./page.module.css";

export default function Cup({ params }: Readonly<{ params: Promise<{ name: string }> }>) {
    const { name } = use(params);
    const router = useRouter();

    const { getGroups, completeRound, completedRounds } = useTournament();

    const [isOpen, setIsOpen] = useState(false);

    const currentGroups = useMemo(() => {
        const groups = getGroups();
        return groups[groups.length - 1];
    }, [getGroups]);

    const nextRound = useCallback(() => {
        completeRound();

        if (isLastCup(name)) {
            router.replace("/tournament/summary");
        } else {
            router.replace(`/tournament/cup/${getNextCup(name)}`);
        }
    }, [completeRound, name, router]);

    useEffect(() => {
        if (completedRounds === 0) {
            router.replace("/tournament/player-setup");
        } else if (indexOfCup(name) !== completedRounds - 1 && !isLastCup(name)) {
            router.replace(`/tournament/cup/${cupForIndex(completedRounds)}`);
        }
    }, [completedRounds, name, router]);

    if (!isCup(name)) {
        return notFound();
    }

    return (
        <>
            <div className={css.title}>
                <img src={`/images/cups/${name}.webp`} alt={`${name} cup`} className={css.image} />
                <h1>Cup</h1>
            </div>
            {currentGroups.length > 0 && <GroupCollection groups={currentGroups} showPlacement={true} />}
            <AddPlayerModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
            <div className="footer">
                <SecondaryButton onClick={() => setIsOpen(true)}>Add player</SecondaryButton>
                <PrimaryButton onClick={nextRound}>
                    {isLastCup(name) ? "Finish tournament" : "Next round"}
                </PrimaryButton>
            </div>
        </>
    );
}
