import { useState } from "react";
import type { AuthData } from "../types";

export default function usePersistedState<T extends Partial<AuthData>>(
    stateKey: string,
    initialState: T | (() => T)
): [T, (value: T | ((prevState: T) => T)) => void] {

    const [state, setState] = useState<T>(() => {
        const persistedState = localStorage.getItem(stateKey);

        if (!persistedState || !persistedState.includes('accessToken')) {
            return typeof initialState === 'function'
                ? (initialState as () => T)()
                : initialState;
        }

        try {
            return JSON.parse(persistedState) as T;
        } catch (err) {
            console.warn("Failed to parse persisted state:", err);
            return typeof initialState === 'function'
                ? (initialState as () => T)()
                : initialState;
        }
    });

    const setPersistedState = (input: T | ((prevState: T) => T)) => {
        const newState = typeof input === 'function'
            ? (input as (prevState: T) => T)(state)
            : input;

        try {

            if (!newState.hasOwnProperty('isSuccessful')) {
                localStorage.removeItem(stateKey);
                return;
            }
            localStorage.setItem(stateKey, JSON.stringify(newState));
        } catch (err) {
            console.warn("Failed to persist state:", err);
        }

        setState(newState);
    };

    return [state, setPersistedState];
}