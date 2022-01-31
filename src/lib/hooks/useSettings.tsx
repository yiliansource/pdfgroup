import { PaletteMode } from "@mui/material";
import React, { createContext, useContext, useEffect, useState } from "react";

import logger from "../log";

/**
 * Represents the persistent settings of the application.
 * These are serialized to the browser's local storage.
 */
export interface Settings {
    /**
     * Preferences that impact the user's experience of the site.
     */
    preferences: {
        /**
         * The theme to use, either "dark" or "light".
         */
        theme: PaletteMode;
    };
    /**
     * The options to apply when exporting an environment.
     */
    exportOptions: {
        /**
         * Renders the pages to images before exporting to potentially reduce file size.
         */
        flatten: boolean;
    };
}
export interface SettingsContextData extends Settings {
    /**
     * Modifies the settings and re-applies them to the context.
     */
    modifySettings(modifier: (settings: Settings) => Settings): void;
}

// The key under which the settings are saved in the local storage.
const SETTINGS_KEY = "applicationSettings";

/**
 * Generates a set of default settings, usually for when none exist yet. It falls back to constants for the backend,
 * but can generate sensible defaults when called on the client.
 */
export function getDefaultSettings(isClient: boolean): Settings {
    return {
        preferences: {
            theme:
                isClient && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light",
        },
        exportOptions: {
            flatten: false,
        },
    };
}

/**
 * Loads the settings of the application. This can not be called on the server.
 */
export function loadSettings(): Settings | null {
    if (typeof window === "undefined") {
        logger.error("Cannot load application settings while not in a client environment.");
        return null;
    }

    const data = window.localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : getDefaultSettings(true);
}

/**
 * Serializes the provided settings to the local storage. This can not be called on the server.
 */
export function saveSettings(settings: Settings): void {
    if (typeof window === "undefined") {
        logger.error("Cannot save application settings while not in a client environment.");
        return;
    }

    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export const SettingsContext = createContext<SettingsContextData>(null!);

/**
 * Exposes the application settings as a hook.
 */
export function useSettings(): SettingsContextData {
    return useContext(SettingsContext);
}

/**
 * Provides the settings context to descendant children.
 */
export function SettingsProvider({ children }: React.PropsWithChildren<unknown>) {
    const [settings, setSettings] = useState(getDefaultSettings(false));

    useEffect(() => {
        // load the settings in a second pass on the client.
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
