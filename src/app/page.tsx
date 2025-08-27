"use client";

import { useReducer, useState } from "react";

import TournamentDisplay from "@/components/TournamentDisplay";
import { Tournament } from "@/lib/tournament";
import styles from "./page.module.css";

const tournament = new Tournament();

export default function Home(): React.ReactNode {
    const [_, forceUpdate] = useReducer((x) => x + 1, 0);

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <AddPlayer
                    onAdd={(name) => {
                        tournament.addPlayer(name);
                        forceUpdate();
                    }}
                />
                <TournamentDisplay
                    groups={tournament.getGroups()}
                    movePlayer={(id, direction) => {
                        tournament.movePlayer(id, direction);
                        forceUpdate();
                    }}
                    updateGroupSize={(id, direction) => {
                        tournament.updateGroupSize(id, direction);
                        forceUpdate();
                    }}
                    completeRound={() => {
                        tournament.completeRound();
                        forceUpdate();
                    }}
                />
            </main>
        </div>
    );
}

function AddPlayer({ onAdd }: Readonly<{ onAdd: (name: string) => void }>): React.ReactNode {
    const [name, setName] = useState("");

    return (
        <label>
            <span>Add player:</span>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key == "Enter") {
                        onAdd(name);
                        setName("");
                    }
                }}
            />
        </label>
    );
}
