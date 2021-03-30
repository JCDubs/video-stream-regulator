import dynamodb from 'serverless-dynamodb-client'
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client'
import {logger} from '@factory/LoggerFactory'

export default class StreamsService {

    public async getNumberOfStreams(userId: string):Promise<number> {
        logger.info(`Executing dynamodb query with userId of '${userId}'`)        
        let result = await dynamodb.doc.query(this.constructPrams(userId)).promise()
        logger.debug({'DynamoDB result': result})
        const numOfStreams = result && result.Count ? result.Count : 0
        logger.info(`User with id '${userId}' is currently watching '${numOfStreams}' streams`)
        return numOfStreams
    }

    private constructPrams(userId: string):DocumentClient.QueryInput {
        const params = {
            TableName: 'streams',
            IndexName: 'streamUser',
            KeyConditionExpression: 'userId = :userIdValue',
            ExpressionAttributeValues: {':userIdValue': userId},
            Select:'COUNT'
        }
        logger.debug({'Query params': params})
        return params
    }
}

export const streamService = new StreamsService()