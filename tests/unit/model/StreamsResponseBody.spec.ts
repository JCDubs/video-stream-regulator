import StreamsResponseBody from '@model/StreamsResponseBody'

describe('StreamsResponseBody tests', () => {

    test('StreamsResponseBody with a max streams value of 3', () => {
        expect(new StreamsResponseBody(3).numOfStreams).toEqual(3)
    })

    test('StreamsResponseBody with a max streams value of 3 cant watch', () => {
        expect(new StreamsResponseBody(3).canWatch).toBeFalsy()
    })

    test('StreamsResponseBody with a max streams value of 2', () => {
        expect(new StreamsResponseBody(2).numOfStreams).toEqual(2)
    })

    test('StreamsResponseBody with a max streams value of 2 can watch', () => {
        expect(new StreamsResponseBody(2).canWatch).toBeTruthy()
    })
})