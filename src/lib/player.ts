import { Branded } from "./brand";

export type Player = {
    id: PlayerId;
    name: string;
    active: boolean;
};

export type PlayerId = Branded<string, "PlayerId">;
