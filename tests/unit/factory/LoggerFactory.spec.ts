import Logger, { logger } from '@factory/LoggerFactory'

describe('LoggerFactory test', () => {

    const logLevels: Array<string> = ['debug', 'info', 'warn', 'error']
    
    test('getLogger returns the same logger instance', () => {
        expect(logger).toEqual(Logger.getLogger())
    })

    logLevels.forEach(logLevel => {
        test(`logger has ${logLevel} method`, () => {
            expect(logger.hasOwnProperty(logLevel)).toBeTruthy()
        })
    })

    test('Check log level is set to warn', () => {
        expect(logger.isLevelEnabled('warn')).toBeTruthy()
    })
})
