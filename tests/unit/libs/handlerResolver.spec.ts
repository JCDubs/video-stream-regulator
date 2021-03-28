import { handlerPath } from '../../../src/libs/handlerResolver';

describe('handlerResolver tests', () => {

    test('handler path returns epxected base handler path', () => {
        expect(handlerPath(__dirname)).toEqual('tests/unit/libs')
    })
})
