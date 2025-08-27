import { useEffect, useState } from "react";
import { useImmer } from "use-immer";

export const useLocalStorageState = <T>(key: string, initialValue: T) => {
    const [value, setValue] = useState<T>(initialValue);

    // Handle loading the initial value
    useEffect(() => {
        const stored = localStorage.getItem(key);
        setValue(stored !== null ? JSON.parse(stored) : initialValue);
    }, [key, initialValue]);

    // Handle when the value changes
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue] as const;
};

export const useLocalStorageImmer = <T>(key: string, initialValue: T) => {
    const [value, setValue] = useImmer<T>(initialValue);

    // Handle loading the initial value
    useEffect(() => {
        const stored = localStorage.getItem(key);
        setValue(stored !== null ? JSON.parse(stored) : initialValue);
    }, [key, initialValue, setValue]);

    // Handle when the value changes
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue] as const;
};
