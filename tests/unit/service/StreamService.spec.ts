jest.mock('serverless-dynamodb-client', () => ({
    __esModule: true,
    default: {doc:{query: jest.fn() }}
}))
import dynamodb from 'serverless-dynamodb-client'
import {streamService} from '../../../src/service/StreamsService'

describe('StreamService test', () => {

    test('getNumberOfStreams returns expected number', async () => {
        const numOfStreams = 3;
        (dynamodb.doc.query as jest.Mock).mockReturnValue({promise: jest.fn(() => {return {Count:numOfStreams}})})
        expect(await streamService.getNumberOfStreams('test-user-id')).toEqual(numOfStreams)
    })

    test('getNumberOfStreams returns an empty response', async () => {
        const numOfStreams = 0;
        (dynamodb.doc.query as jest.Mock).mockReturnValue({promise: jest.fn(() => {return null})})
        expect(await streamService.getNumberOfStreams('test-user-id')).toEqual(numOfStreams)
    })

    test('getNumberOfStreams returns a null Count in the response', async () => {
        const numOfStreams = 0;
        (dynamodb.doc.query as jest.Mock).mockReturnValue({promise: jest.fn(() => {return {}})})
        expect(await streamService.getNumberOfStreams('test-user-id')).toEqual(numOfStreams)
    })
})
