import { PaletteMode } from "@mui/material";
import React, { createContext, useContext, useEffect, useState } from "react";

import logger from "../log";

export interface Settings {
    preferences: {
        theme: PaletteMode;
    };
    exportOptions: {
        flatten: boolean;
    };
}
export interface SettingsContextData extends Settings {
    modifySettings(modifier: (settings: Settings) => Settings): void;
}

const SETTINGS_KEY = "applicationSettings";

export function getDefaultSettings(client: boolean): Settings {
    return {
        preferences: {
            theme:
                client && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light",
        },
        exportOptions: {
            flatten: false,
        },
    };
}

export function loadSettings(): Settings | null {
    if (typeof window === "undefined") {
        logger.error("Cannot load application settings while not in a client environment.");
        return null;
    }

    const data = window.localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : getDefaultSettings(true);
}

export function saveSettings(settings: Settings): void {
    if (typeof window === "undefined") {
        logger.error("Cannot save application settings while not in a client environment.");
        return;
    }

    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export const SettingsContext = createContext<SettingsContextData>(null!);

export function useSettings(): SettingsContextData {
    return useContext(SettingsContext);
}

export function SettingsProvider({ children }: React.PropsWithChildren<unknown>) {
    const [settings, setSettings] = useState<Settings>(getDefaultSettings(false));

    useEffect(() => {
        setSettings(loadSettings()!);
    }, []);

    const modifySettings: (modifier: (s: Settings) => Settings) => void = (modifier) => {
        const s = modifier(settings);

        setSettings(s);
        saveSettings(s);

        logger.info("Settings updated: " + JSON.stringify(s));
    };

    return (
        <SettingsContext.Provider
            value={{
                ...settings,
                modifySettings,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}
