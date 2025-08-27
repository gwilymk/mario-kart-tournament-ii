"use client";

import { PropsWithChildren } from "react";

import { TournamentProvider } from "@/components/TournamentContext";
import css from "./layout.module.css";

export default function TournamentLayout({ children }: Readonly<PropsWithChildren>) {
    return (
        <TournamentProvider>
            <div className={css.page}>
                <main className={css.main}>{children}</main>
            </div>
        </TournamentProvider>
    );
}
