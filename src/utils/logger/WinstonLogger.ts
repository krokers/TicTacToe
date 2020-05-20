import {ILogger} from "./ILogger";
import {createLogger, format, Logger, transports} from 'winston'
import {injectable} from "inversify";

@injectable()
export default class WinstonLogger implements ILogger{
    private logger: Logger;

    constructor() {
        this.logger = this.initializeWinston();
    }

    private initializeWinston() {
        return createLogger({
            level: 'verbose',
            format: format.combine(
                format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss'
                }),
                format.errors({stack: true}),
                format.splat(),
                format.json()
            ),
            defaultMeta: {service: 'tic-tac-toe'},
            transports: [
                new transports.Console({
                    format: format.combine(
                        format.colorize(),
                        format.simple()
                    )
                })
            ]
        });
    }

    v(message: string, ...meta: any[]) {
        this.logger.verbose(message, ...meta);
    }

    i(message: string, ...meta: any[]) {
        this.logger.info(message, ...meta);
    }

    e(message: string, ...meta: any[]) {
        this.logger.error(message, ...meta);
    }
}