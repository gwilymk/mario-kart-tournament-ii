import { CSSProperties, FC, Fragment, useMemo } from "react";

import { GroupPlayer } from "@/components/GroupPlayer";
import { Player } from "@/lib/player";
import css from "./Chart.module.css";

interface Datum {
    player: Player;
    values: (number | undefined | null)[];
}

interface PlotCSS extends CSSProperties {
    "--colour": string;
}

const Plot: FC<{ colour: string; value: number | undefined | null; column: number }> = ({ colour, column, value }) => {
    const hasValue = value !== undefined && value !== null;

    return (
        <span
            className={css.plot}
            style={
                {
                    "--colour": hasValue ? colour : undefined,
                    gridRow: hasValue ? value + 1 : undefined,
                    gridColumn: column,
                } as PlotCSS
            }
        ></span>
    );
};

const Name: FC<{ player: Player; colour: string; row: number }> = ({ player, colour, row }) => (
    <span className={css.name} style={{ gridRow: row, "--colour": colour } as PlotCSS}>
        <GroupPlayer player={player} showPlacement={false} />
    </span>
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

export const Chart: FC<ChartProps> = ({ data }) => {
    const columns = useMemo(() => Math.max(...data.map(({ values }) => values.length)), [data]);

    return (
        <div>
            <div className={css.chart} style={{ "--rows": data.length, "--columns": columns } as ChartCSS}>
                {data.map(({ player, values }, index) => {
                    const colour = getColour(index);
                    return (
                        <Fragment key={player.id}>
                            <Name player={player} row={index + 1} colour={colour} />
                            {values.map((value, index) => (
                                <Plot key={index} colour={colour} value={value} column={index + 2} />
                            ))}
                        </Fragment>
                    );
                })}
            </div>
        </div>
    );
};
