import winston from "winston";
import { Config } from ".";

const logger = winston.createLogger({
    level: "info",
    defaultMeta: {
        serviceName: "auth-service",
    },
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
    transports: [
        new winston.transports.File({
            dirname: "logs",
            filename: "combined.log",
            level: "info",
            silent: Config.NODE_ENV === "test",
        }),
        new winston.transports.File({
            dirname: "logs",
            filename: "error.log",
            level: "error",
            silent: Config.NODE_ENV === "test",
        }),
        new winston.transports.Console({
            level: "info",
            silent: Config.NODE_ENV === "test",
        }),
    ],
});

export default logger;

/**
 
import winston from "winston";
import { Config } from ".";

// Define custom colors for different log levels
winston.addColors({
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "blue",
});

const consoleFormat = winston.format.combine(
    winston.format.colorize({ all: true }), // apply colors to all levels
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ timestamp, level, message, serviceName }) => {
        return `[${timestamp}] [${serviceName}] ${level}: ${message}`;
    })
);

const fileFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
);

const logger = winston.createLogger({
    level: "info",
    defaultMeta: {
        serviceName: "auth-service",
    },
    transports: [
        // File transports (no colors, JSON)
        new winston.transports.File({
            dirname: "logs",
            filename: "combined.log",
            level: "info",
            format: fileFormat,
            silent: Config.NODE_ENV === "test",
        }),
        new winston.transports.File({
            dirname: "logs",
            filename: "error.log",
            level: "error",
            format: fileFormat,
            silent: Config.NODE_ENV === "test",
        }),

        // Console transport (colored output)
        new winston.transports.Console({
            level: "info",
            format: consoleFormat,
            silent: Config.NODE_ENV === "test",
        }),
    ],
});

export default logger;


 
 */
