interface ReplacedMap<K, V> {
    dataType: "Map";
    entries: [K, V][];
}

const jsonReplacer = <T>(key: string, value: T) => {
    if (value instanceof Map) {
        return {
            dataType: "Map",
            entries: Array.from(value.entries()),
        };
    } else {
        return value;
    }
};

const isReplacedMap = <K, V>(x: unknown): x is ReplacedMap<K, V> => {
    return (
        x !== undefined &&
        x !== null &&
        typeof x === "object" &&
        "dataType" in x &&
        "entries" in x &&
        x.dataType === "Map"
    );
};

const jsonReviver = (key: string, value: unknown) => {
    if (isReplacedMap(value)) {
        return new Map(value.entries);
    }
    return value;
};

export const toJson = (value: unknown) => JSON.stringify(value, jsonReplacer);

export const parseJson = (text: string) => JSON.parse(text, jsonReviver);
