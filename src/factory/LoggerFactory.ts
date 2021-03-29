import pino from 'pino'

export default class Logger {

    private static logger: pino.Logger

    static getLogger(): pino.Logger {
        if (!this.logger) {
            this.logger = pino({level: process.env.LOG_LEVEL || 'warn'})
        }
        return this.logger
    }
}

export const logger = Logger.getLogger()
