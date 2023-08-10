import { LogLevel } from "./log-level";
import { LogMarker } from "./log-marker";

export interface LogEvent {
    level: LogLevel;
    marker: LogMarker;
    messages: unknown[];
}
