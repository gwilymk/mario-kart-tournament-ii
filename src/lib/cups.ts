const cups = ["shell", "banana", "leaf", "lightning", "mushroom", "flower", "star", "special"];

export type Cup = (typeof cups)[number];

export const isCup = (name: string): name is Cup => cups.includes(name);

type NextCup = Omit<Cup, "shell"> | undefined;

export const getNextCup = (cup: Cup): NextCup => {
    const cupIndex = cups.indexOf(cup);

    return cups[cupIndex + 1];
};

export const isLastCup = (cup: Cup) => cup === cups[cups.length - 1];

export const indexOfCup = (cup: Cup) => cups.indexOf(cup);

export const cupForIndex = (index: number): Cup | undefined => cups[index];

export const firstCup = cups[0];
