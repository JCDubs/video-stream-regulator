export default class StreamsResponseBody {
    canWatch: boolean
    numOfStreams: number

    constructor(numOfStreams:number) {
        this.canWatch = numOfStreams < (process.env.MAX_STREAMS || 3)
        this.numOfStreams = numOfStreams
    }
}
