import chalk from "chalk";

export enum LogLevel {
    debug = "debug",
    info = "info",
    warn = "warn",
    error = "error",
}
export const LogLevelSeverity: Record<LogLevel, number> = {
    [LogLevel.debug]: 0,
    [LogLevel.info]: 1,
    [LogLevel.warn]: 2,
    [LogLevel.error]: 3,
};

class Logger {
    public level: LogLevel = LogLevel.info;

    public log(level: LogLevel, message: string): void {
        this[level](message);
    }

    public debug(message: string): void {
        if (LogLevelSeverity[this.level] > LogLevelSeverity.debug) return;
        console.debug(this.format(message, LogLevel.debug));
    }
    public info(message: string): void {
        if (LogLevelSeverity[this.level] > LogLevelSeverity.info) return;
        console.info(this.format(message, LogLevel.info));
    }
    public warn(message: string): void {
        if (LogLevelSeverity[this.level] > LogLevelSeverity.warn) return;
        console.warn(this.format(message, LogLevel.warn));
    }
    public error(message: string): void {
        if (LogLevelSeverity[this.level] > LogLevelSeverity.error) return;
        console.error(this.format(message, LogLevel.error));
    }

    private format(message: string, level: LogLevel): string {
        return [
            chalk.gray("[" + new Date().toTimeString().split(" ")[0] + "]"),
            level.toString().toUpperCase(),
            chalk.gray("•"),
            message,
        ].join(" ");
    }
}

const logger = new Logger();
logger.level = process.env.NODE_ENV === "development" ? LogLevel.debug : LogLevel.warn;

export default logger;
