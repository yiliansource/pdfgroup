import { PaletteMode } from "@mui/material";
import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";

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

export const settingsAtom = atom<Settings>({
    key: SETTINGS_KEY,
    default: getDefaultSettings(false),
});

export function SettingsAtomEffect() {
    const [settings, setSettings] = useRecoilState(settingsAtom);
    useEffect(() => {
        if (typeof window === "undefined") {
            logger.error("Cannot load application settings while not in a client environment.");
        } else {
            const data = localStorage.getItem(SETTINGS_KEY);
            const settings = data ? JSON.parse(data) : getDefaultSettings(true);
            setSettings(settings);
        }
    }, [setSettings]);
    useEffect(() => {
        if (typeof window === "undefined") {
            logger.error("Cannot save application settings while not in a client environment.");
        } else {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        }
    }, [settings]);
    return null;
}
