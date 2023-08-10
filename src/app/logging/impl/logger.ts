import { LogLevel } from '../model/log-level';
import { LogEvent } from '../model/log-event';
import { LogMarker } from '../model/log-marker';
import { NAMED_LOGGER_SYMBOL } from '../decorators/named-logger';
import { Injectable } from '@angular/core';
import { assertUnreachable } from '@pdfgroup/shared/util/assert';

@Injectable()
export class Logger {
    public debug(context: unknown, ...messages: unknown[]): void {
        this.print(this.createLogEvent(LogLevel.Debug, context, messages));
    }

    public info(context: unknown, ...messages: unknown[]): void {
        this.print(this.createLogEvent(LogLevel.Info, context, messages));
    }

    public warn(context: unknown, ...messages: unknown[]): void {
        this.print(this.createLogEvent(LogLevel.Warn, context, messages));
    }

    public error(context: unknown, ...messages: unknown[]): void {
        this.print(this.createLogEvent(LogLevel.Error, context, messages));
    }

    private print(event: LogEvent): void {
        const consoleLevelName = this.getConsoleLevel(event.level);
        console[consoleLevelName](
            `%c[${event.marker.name}]%c[${this.getLevelName(event.level)}]`,
            this.getMarkerStyles(event.marker),
            this.getLevelStyles(event.level),
            ...event.messages
        );
    }

    private getMarkerStyles(marker: LogMarker): string {
        return `color: white; background: hsl(${marker.color}, 100%, 40%); padding: 4px; font-weight: bold;`;
    }

    private getLevelStyles(level: LogLevel): string {
        return `color: ${LOG_LEVEL_COLOR_LOOKUP[level]}; padding: 4px;`;
    }

    private createLogEvent(level: LogLevel, context: unknown, messages: unknown[]): LogEvent {
        return {
            level,
            marker: this.getLoggerMarker(context),
            messages,
        };
    }

    private getLoggerMarker(context: unknown): LogMarker {
        const data: LogMarker | undefined = (context as any)?.[NAMED_LOGGER_SYMBOL];
        if (data !== undefined) {
            return {
                name: data.name,
                color: data.color,
            };
        }

        return {
            name: '<anonymous>',
            color: 180,
        };
    }

    private getLevelName(level: LogLevel): string {
        switch (level) {
            case LogLevel.Debug:
                return 'Debug';
            case LogLevel.Error:
                return 'Error';
            case LogLevel.Info:
                return 'Info';
            case LogLevel.Warn:
                return 'Warn';
            default:
                assertUnreachable(level);
        }
    }

    private getConsoleLevel(level: LogLevel): keyof Pick<Console, 'debug' | 'error' | 'info' | 'warn'> {
        switch (level) {
            case LogLevel.Debug:
                return 'debug';
            case LogLevel.Error:
                return 'error';
            case LogLevel.Info:
                return 'info';
            case LogLevel.Warn:
                return 'warn';
            default:
                assertUnreachable(level);
        }
    }
}

const LOG_LEVEL_COLOR_LOOKUP: Record<LogLevel, string> = {
    [LogLevel.Debug]: 'floralwhite',
    [LogLevel.Info]: 'cornflowerblue',
    [LogLevel.Warn]: 'gold',
    [LogLevel.Error]: 'crimson',
};
