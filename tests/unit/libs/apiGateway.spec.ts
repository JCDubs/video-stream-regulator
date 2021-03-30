import { formatJSONResponse } from '@libs/apiGateway';

describe('apiGateway tests', () => {

    test('formatJSONResponse returns expected response', () => {
        expect(formatJSONResponse({message: 'test response message'})).toEqual({body: '{"message":"test response message"}', statusCode: 200})
    })
})