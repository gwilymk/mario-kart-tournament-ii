"use client";

import { FormEventHandler, useState } from "react";
import KeyboardReturn from "@mui/icons-material/KeyboardReturn";

import { IconButton } from "@/components/Button";
import { Input } from "@/components/Input";
import { useTournament } from "@/components/TournamentContext";

interface PlayerNameInputProps {
    onPlayerAdded?: (name: string) => void;
}

export default function PlayerNameInput({ onPlayerAdded }: PlayerNameInputProps) {
    const { addPlayer } = useTournament();
    const [playerName, setPlayerName] = useState("");

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();

        const trimmedPlayerName = playerName.trim();

        if (trimmedPlayerName.length === 0) {
            return;
        }

        addPlayer(trimmedPlayerName);
        onPlayerAdded?.(trimmedPlayerName);

        setPlayerName("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input
                name="Player name"
                placeholder="Player name.."
                autoComplete="off"
                spellCheck={false}
                value={playerName}
                onChange={setPlayerName}
                rightIcon={
                    <IconButton type="submit" onClick={() => {}}>
                        <KeyboardReturn />
                    </IconButton>
                }
            />
        </form>
    );
}
