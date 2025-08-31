"use client";

import { CSSProperties, FC, forwardRef, Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";

import CupIcon from "@/components/CupIcon";
import { GroupPlayer } from "@/components/GroupPlayer";
import { Cup, cups } from "@/lib/cups";
import { Player } from "@/lib/player";
import css from "./Chart.module.css";

interface Datum {
    player: Player;
    values: (number | undefined | null)[];
}

interface PlotCSS extends CSSProperties {
    "--colour": string;
}

const Plot = forwardRef<
    HTMLSpanElement,
    { id: string; colour: string; value: number | undefined | null; column: number }
>(({ id, colour, column, value }, ref) => {
    const hasValue = value !== undefined && value !== null;

    return (
        <span
            className={css.plot}
            style={
                {
                    "--colour": hasValue ? colour : undefined,
                    gridRow: hasValue ? value + 2 : undefined,
                    gridColumn: column,
                } as PlotCSS
            }
            data-line-id={hasValue ? id : undefined}
            ref={ref}
        ></span>
    );
});

const Name: FC<{ player: Player; colour: string; row: number; column: number }> = ({ player, colour, row, column }) => (
    <span className={css.name} style={{ gridRow: row, gridColumn: column, "--colour": colour } as PlotCSS}>
        <GroupPlayer player={player} showPlacement={false} />
    </span>
);

const CupHeader: FC<{ cup: Cup; index: number }> = ({ cup, index }) => (
    <div className={css.cup} style={{ gridColumn: index + 3 }}>
        <CupIcon cup={cup} />
    </div>
);

interface ChartProps {
    data: Datum[];
}

interface ChartCSS extends CSSProperties {
    "--rows": number;
    "--columns": number;
}

const colours = [
    "var(--color-baby-pink)",
    "var(--color-orange)",
    "var(--color-green)",
    "var(--color-blue)",
    "var(--color-pink)",
    "var(--color-apricot-orange)",
    "var(--color-turquoise-green)",
    "var(--color-blue-black)",
    "var(--color-rose-pink)",
    "var(--color-yellow)",
    "var(--color-light-blue)",
    "var(--color-violet)",
    "var(--color-coral-pink)",
    "var(--color-apple-green)",
    "var(--color-sky-blue)",
    "var(--color-grape)",
    "var(--color-red)",
    "var(--color-leaf-green)",
    "var(--color-aqua-blue)",
    "var(--color-dark-red)",
];

const getColour = (index: number) => {
    return colours[index % colours.length];
};

const Lines: FC<{ colours: Map<string, string>; points: Map<string, Map<number, HTMLSpanElement | null>> }> = ({
    colours,
    points,
}) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, setCounter] = useState(0);

    const forceRender = useCallback(() => setCounter((currentValue) => currentValue + 1), []);

    useEffect(() => {
        const resize = () => {
            forceRender();
        };

        window.addEventListener("resize", resize);

        return () => window.removeEventListener("resize", resize);
    }, [forceRender]);

    useEffect(() => {
        if (points.size > 0) {
            forceRender();
        }
    }, [forceRender, points]);

    const groupedLines = points
        .values()
        .flatMap((x) => x.values().filter((x) => x !== null))
        .map((x) => [x.getAttribute("data-line-id")!, x] as const)
        .toArray()
        .sort((a, b) => {
            const aRect = a[1].getBoundingClientRect();
            const bRect = b[1].getBoundingClientRect();

            return aRect.left - bRect.left;
        })
        .reduce((map, [id, x]) => {
            if (map.has(id)) {
                map.get(id)!.push(x);
            } else {
                map.set(id, [x]);
            }
            return map;
        }, new Map<string, Element[]>());

    const lines = [];

    for (const [id, elements] of groupedLines.entries()) {
        const colour = colours.get(id)!;

        for (let i = 0; i < elements.length - 1; i++) {
            const startElement = elements[i];
            const endElement = elements[i + 1];

            const startRect = startElement.getBoundingClientRect();
            const endRect = endElement.getBoundingClientRect();

            const startCentreX = startRect.left + startRect.width / 2;
            const startCentreY = startRect.top + startRect.height / 2;
            const endCentreX = endRect.left + endRect.width / 2;
            const endCentreY = endRect.top + endRect.height / 2;

            const deltaX = startCentreX - endCentreX;
            const deltaY = startCentreY - endCentreY;

            const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

            lines.push(
                <span
                    key={`${id}-${i}`}
                    className={css.line}
                    style={
                        {
                            left: endCentreX,
                            top: endCentreY,
                            width: length,
                            transform: `rotate(${angle}deg)`,
                            "--colour": colour,
                        } as PlotCSS
                    }
                ></span>
            );
        }
    }

    return <div>{lines}</div>;
};

export const Chart: FC<ChartProps> = ({ data }) => {
    const columns = useMemo(() => Math.max(...data.map(({ values }) => values.length)), [data]);

    const colours = useMemo(
        () =>
            new Map(
                data.map(({ player }, index) => {
                    const colour = getColour(index);
                    return [player.id, colour];
                })
            ),
        [data]
    );

    const points = useRef(
        new Map<string, Map<number, HTMLSpanElement | null>>(data.map((x) => [x.player.id, new Map()]))
    );

    const finalRoster = useMemo(
        () =>
            data
                .filter(({ values }) => values[columns - 1] !== undefined)
                .sort(({ values: valuesA }, { values: valuesB }) => valuesA[columns - 1]! - valuesB[columns - 1]!)
                .map(({ player }) => player),
        [columns, data]
    );

    return (
        <div className={css.container}>
            <div className={css.chart} style={{ "--rows": data.length, "--columns": columns } as ChartCSS}>
                {cups.map((cup, index) => (
                    <CupHeader cup={cup} key={cup} index={index} />
                ))}
                {data.map(({ player, values }, index) => {
                    const colour = colours.get(player.id)!;
                    const endPlayer = finalRoster[index];
                    return (
                        <Fragment key={player.id}>
                            <Name player={player} row={index + 2} colour={colour} column={0} />
                            {values.map((value, index) => (
                                <Plot
                                    key={index}
                                    colour={colour}
                                    value={value}
                                    column={index + 2}
                                    id={player.id}
                                    ref={(x) => {
                                        points.current.get(player.id)!.set(index, x);
                                    }}
                                />
                            ))}
                            {endPlayer && (
                                <Name
                                    player={endPlayer}
                                    row={index + 2}
                                    colour={colours.get(endPlayer.id)!}
                                    column={columns + 2}
                                />
                            )}
                        </Fragment>
                    );
                })}
            </div>
            <Lines colours={colours} points={points.current} />
        </div>
    );
};
