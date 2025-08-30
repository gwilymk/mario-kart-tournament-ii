import { useEffect, useState } from "react";
import { enableMapSet } from "immer";
import { useImmer } from "use-immer";

import { parseJson, toJson } from "@/lib/json";

const _localStorage = typeof window !== "undefined" ? window.localStorage : null;

enableMapSet();

export const useLocalStorageState = <T>(key: string, initialValue: T) => {
    const [value, setValue] = useState<T>(initialValue);
    const [hasLoaded, setHasLoaded] = useState(false);

    // Handle loading the initial value
    useEffect(() => {
        const stored = _localStorage?.getItem(key);
        setValue(stored ? parseJson(stored) : initialValue);
        setHasLoaded(true);
    }, [key, initialValue]);

    // Handle when the value changes
    useEffect(() => {
        _localStorage?.setItem(key, toJson(value));
    }, [key, value]);

    return [value, setValue, hasLoaded] as const;
};

export const useLocalStorageImmer = <T>(key: string, initialValue: T) => {
    const [value, setValue] = useImmer<T>(initialValue);
    // A hack to prevent maximum recursion depth when reading from storage
    const [storedKey, setStoredKey] = useState<string | undefined>(undefined);

    // Handle loading the initial value
    useEffect(() => {
        if (storedKey === key) {
            return;
        }

        const stored = _localStorage?.getItem(key);

        setValue(stored ? parseJson(stored) : initialValue);
        setStoredKey(key);
    }, [key, initialValue, setValue, storedKey]);

    // Handle when the value changes
    useEffect(() => {
        _localStorage?.setItem(key, toJson(value));
    }, [key, value]);

    const hasLoaded = storedKey !== undefined;

    return [value, setValue, hasLoaded] as const;
};
