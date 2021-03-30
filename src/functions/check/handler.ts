import 'source-map-support/register';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { streamService } from '@service/StreamsService';
import StreamsResponseBody from '@model/StreamsResponseBody'
import { logger } from '@factory/LoggerFactory'

const check:ValidatedEventAPIGatewayProxyEvent<StreamsResponseBody> = async (event) => {
  try {
    logger.info(`Streams check service called with '${event.pathParameters.userId}' userId`)
    const numOfStreams = await streamService.getNumberOfStreams(event.pathParameters.userId)
    const response = formatJSONResponse(new StreamsResponseBody(numOfStreams))
    logger.debug({'Response': response})
    return response
  } catch (error) {
    logger.error(error.message, error)
    return formatJSONResponse({message: error.message}, 500)
  }
}

export const main = middyfy(check);
