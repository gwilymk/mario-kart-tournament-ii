"use client";

import { FC, useMemo } from "react";

import { useTournament } from "@/components/TournamentContext";
import { Chart } from "@/components/TournamentSummary/Chart";

export const TournamentSummary: FC = () => {
    const { summary } = useTournament();

    const data = useMemo(
        () =>
            summary.map(({ player, positions }) => ({
                player,
                values: positions,
            })),
        [summary]
    );

    return <Chart data={data} />;
};
