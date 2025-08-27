import { useEffect, useState } from "react";
import { useImmer } from "use-immer";

const _localStorage = typeof window !== "undefined" ? window.localStorage : null;

export const useLocalStorageState = <T>(key: string, initialValue: T) => {
    const [value, setValue] = useState<T>(initialValue);

    // Handle loading the initial value
    useEffect(() => {
        const stored = _localStorage?.getItem(key);
        setValue(stored ? JSON.parse(stored) : initialValue);
    }, [key, initialValue]);

    // Handle when the value changes
    useEffect(() => {
        _localStorage?.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue] as const;
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

        setValue(stored ? JSON.parse(stored) : initialValue);
        setStoredKey(key);
    }, [key, initialValue, setValue, storedKey]);

    // Handle when the value changes
    useEffect(() => {
        _localStorage?.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue] as const;
};
