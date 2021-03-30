jest.mock('serverless-dynamodb-client', () => ({
    __esModule: true,
    default: {doc:{query: jest.fn() }}
}))
import dynamodb from 'serverless-dynamodb-client'
import {streamService} from '../../../src/service/StreamsService'

describe('StreamService test', () => {

    test('exceedsAvailableStreams returns true when streams is three', async () => {
        (dynamodb.doc.query as jest.Mock).mockReturnValue({promise: jest.fn(() => {return {Count:3}})}) //.mockReturnValue({Count: 3})
        expect(await streamService.exceedsAvailableStreams('test-user-id')).toBeTruthy()
    })

    test('exceedsAvailableStreams returns false when streams is under three', async () => {
        (dynamodb.doc.query as jest.Mock).mockReturnValue({promise: jest.fn(() => {return {Count:2}})}) //.mockReturnValue({Count: 3})
        expect(await streamService.exceedsAvailableStreams('test-user-id')).toBeFalsy()
    })
})