jest.mock('@factory/LoggerFactory')
jest.mock('@service/StreamsService', () => ({
    __esModule: true,
    streamService: {getNumberOfStreams: jest.fn()}
}))
import {main as check} from '@functions/check/handler'
import {streamService} from '@service/StreamsService'

describe('Check handler test', () => {
    
    let response
    let body

    describe('Less than three streams', () =>{
        
        beforeEach(async () => {
            (streamService.getNumberOfStreams as jest.Mock).mockReturnValue(2)
            response = await check({pathParameters: {userId: 'c9d09a26a5967a384fbbb8d10322c8ea49d3be976926930f549d0950'}}, null, null)
            body = JSON.parse(response.body)
        })

        test('Response status is 200', () => {
            expect(response.statusCode).toEqual(200)
        })

        test('Response body is as expected', () => {
            expect(body).toEqual({ canWatch:true, numOfStreams:2 })
        })
    })

    describe('Three streams', () =>{
        
        beforeEach(async () => {
            (streamService.getNumberOfStreams as jest.Mock).mockReturnValue(3)
            response = await check({pathParameters: {userId: 'c9d09a26a5967a384fbbb8d10322c8ea49d3be976926930f549d0950'}}, null, null)
            body = JSON.parse(response.body)
        })

        test('Response status is 200', () => {
            expect(response.statusCode).toEqual(200)
        })

        test('Response body is as expected', () => {
            expect(body).toEqual({ canWatch:false, numOfStreams:3 })
        })
    })
    
    describe('Handler catches an error', () => {

        beforeEach(async () => {
            (streamService.getNumberOfStreams as jest.Mock).mockRejectedValue(new Error('test dynamodb error'))
            response = await check({pathParameters: {userId: 'c9d09a26a5967a384fbbb8d10322c8ea49d3be976926930f549d0950'}}, null, null)
            body = JSON.parse(response.body)
        })

        test('Response status is 200', async () => {
            expect(response.statusCode).toEqual(500)
        })

        test('Response body is as expected', async () => {
            expect(body).toEqual({message: 'test dynamodb error'})
        })
    })
})
