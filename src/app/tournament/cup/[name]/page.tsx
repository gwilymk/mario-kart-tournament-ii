"use client";

import { use, useCallback, useEffect, useMemo } from "react";
import { notFound, useRouter } from "next/navigation";

import { PrimaryButton } from "@/components/Button";
import { GroupCollection } from "@/components/Group";
import { useTournament } from "@/components/TournamentContext";
import { cupForIndex, getNextCup, indexOfCup, isCup, isLastCup } from "@/lib/cups";
import css from "./page.module.css";

export default function Cup({ params }: Readonly<{ params: Promise<{ name: string }> }>) {
    const { name } = use(params);
    const router = useRouter();

    const { getGroups, completeRound } = useTournament();
    const { getGroups, completeRound, completedRounds } = useTournament();

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
        if (indexOfCup(name) !== completedRounds) {
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
            <div className="footer">
                <PrimaryButton onClick={nextRound}>
                    {isLastCup(name) ? "Finish tournament" : "Next round"}
                </PrimaryButton>
            </div>
        </>
    );
}
