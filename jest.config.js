module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: true,
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100
        }
    },
    moduleNameMapper: {
        '@functions/(.*)': ['<rootDir>/src/functions/$1'],
        '@libs/(.*)': ['<rootDir>/src/libs/$1'],
        '@service/(.*)': ['<rootDir>/src/service/$1'],
        '@model/(.*)': ['<rootDir>/src/model/$1'],
        '@factory/(.*)': ['<rootDir>/src/factory/$1']
    }
};