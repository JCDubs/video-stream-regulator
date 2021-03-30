import dynamodb from 'serverless-dynamodb-client'
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client'
import {logger} from '../factory/LoggerFactory'

export default class StreamsService {

    public async exceedsAvailableStreams(userId: string):Promise<boolean> {
        logger.info(`Executing dynamodb query with userId of "${userId}".`)        
        let result = await dynamodb.doc.query(this.constructPrams(userId)).promise()
        logger.debug(`Recieved dynamodb result`, result)
        const exceeds = result && result.Count >= 3
        logger.info(`User with id "${userId}" has ${!exceeds ? 'not' : ''} exceeded the possible number of streams.`)
        return exceeds
    }

    private constructPrams(userId: string):DocumentClient.QueryInput {
        const params = {
            TableName: 'streams',
            IndexName: 'streamUser',
            KeyConditionExpression: 'userId = :userIdValue',
            ExpressionAttributeValues: {':userIdValue': userId},
            Select:'COUNT'
        }
        logger.debug('DynamoDB query params consist of', params)
        return params
    }
}

export const streamService = new StreamsService()