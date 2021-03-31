# Video Stream Regulator

The video stream regulator service checks how many video streams a given user is watching and prevents users from watching more than a set number of streams concurrently.

This project has been generated using the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/). For detailed instructions, please refer to the [documentation](https://www.serverless.com/framework/docs/providers/aws/).

## Project decisions

The specification for this project was to create a node.js API endpoint providing the ability to prevent a user from watching more than three video streams concurrently. It has been decided that implementing this solution as an AWS Lambda is both the most simplest and cost effective solution.  

The only time AWS Lambda might not be the most cost effective solution is if the number of requests exceeds 1,000,000 requests a second. In this scenario, it might be more cost effective to deploy the function within an express application as a Docker container through a serverless container orchestration platform such as [AWS Fargate](https://aws.amazon.com/fargate/).

It has also been decided that a single REST GET endpoint will be more than sufficient to provide the request data required through path parameters to count the current streams used by a user, this being a single userId. It has also been assumed that the items would be added to the streams table though another REST service. This service will only be responsible for checking the number of current streams, not adding and removing stream records.

### Database

It has been decided to use DynamoDB to store the user streaming data. The DynamoDB schema has been provided though the _serverless.ts_ file containing the `streams` table attribute definitions as well as a global index to speed up scanning and querying of non primary key data. It has also been decided that the DynamoDb table will only require two attributes to fulfill the functional requirements; `userId` and `streamId`. It is assumed that each stream will be associated to a unique `streamId` hash value which will be used in the `streams` table as the primary key. The only other attribute is the `userId` which might not be unique per table item and therefore has been configured to be the attribute used in the `streamUser` global secondary index.

### Scaling

AWS Lambda automtically scales orchestrating one lambda invokation per one API Gateway request. Lambda scaling would need to be discussed if it is believed that the number of requests a second will exceed 10000 or 1000 concurrent requests. It is possible to request an increase in thes values by submitting a request to AWS.

As mentioned above, it might be decided to migrate the lambda function to AWS Fargate as an Express Docker container. Scaling can be acheived in this scenario by deploying an ELB (Eastic Load Balancer) and utilising it's autoscaling functionality allowing users to specify when to deploy more instances of a service by defining CPU and memory threshold. Doing so will ensure that more instances of a service are provisioned when the CPU and/or memory reaches the specified threshold such as 80% etc.

### Logging and Debugging

Debugging can best be performed using the LOG_LEVEL Lambda environment variable which can be changed via the AWS console without having to modify config and redeploy the service. The following logging functionality has been implemented in the service.

- error - The check handler logic has been wrapped in a try/catch block, invoking the pino logger error function with the thrown error message and object.
- info - The service contains a number of pino logger info methof invocation to log some of the important stages of the service. The info messages will be logged when the log level has been set as info or below.
- debug - The service contains a number of pino debug method invocation where key object such as DynamoDB request, DynamoDB response and lambda response are output in the logging messages. The debug logs will be output when the log level has been set as debug.

## Installation/deployment instructions

Depending on your preferred package manager, follow the instructions below to deploy your project.

> **Requirements**: NodeJS `lts/fermium (v.14.15.0)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

### Using NPM

- Run `npm i` to install the project dependencies
- Run `npx sls deploy` to deploy this stack to AWS

### Using Yarn

- Run `yarn` to install the project dependencies
- Run `yarn sls deploy` to deploy this stack to AWS

## Local deployment & development

The project has been configured to run a local instance of the lambda function as well as a local instance of DynamoDB via the [serverless-offline](https://www.npmjs.com/package/serverless-offline) and [serverless-dynamodb-local](https://www.npmjs.com/package/serverless-dynamodb-local) Serverless plugins. A full version of the service can be run locally with the following commands.

### Using NPM

- Run `npm run db:local` in one terminal to start the DynamoDB local instance, create the streams table and populate it with the contents of the _./streamSeeds.json_ file.
- Run `npm run start` in another terminal to start the lambda function. Doing so will make the function available at http://localhost:3000.

### Using Yarn

- Run `yarn db:local` in one terminal to start the DynamoDB local instance, create the streams table and populate it with the contents of the _./streamSeeds.json_ file.
- Run `yarn start` in another terminal to start the lambda function. Doing so will make the function available at http://localhost:3000.

Once both commands are run, the /streams/check/{userId} GET endpoint will be accessible at http://localhost:3000. The function can be invoked either by terminal, browser or Postman by navigating to the _http://localhost:3000/streams/check/{userId}_ endpoint replacing the _{userId}_ with one of the userId's in the _./streamSeeds.json_ file.

The _./streamSeeds.json_ file contains records to generate the three possible scenarios producable by the /streams/check lambda; a user watching three streams, a user watching less than three streams and a user not watching any streams.

## Tests

The project contains _unit_ and _end to end (e2e)_ tests. 

### Unit tests

The unit tests are located in the _tests/unit_ directory and have been implemented using [Jest](https://jestjs.io/). The unit tests can be run by executing the following cammand.

#### Using npm

- Run `npm run test:unit`

#### Using Yarn

- Run `yarn test:unit`

Doing so will run all unit tests and output the test coverage in the terminal.

### e2e tests

The end to end tests are located in the _tests/e2e_ directory and have been implememted using [cucumber.js](https://cucumber.io/docs/installation/javascript/). The e2e tests can be run by executing the following commands.

#### Using npm

- Run `nom run db:local` in one terminal to start the DynamoDB including creation of the streams table and seed data.
- Run `npm run start` in a second terminal to start the lambda locally.
- Run `npm run cucumber` in a third terminal to run the end to end tests.

#### Using Yarn

- Run `nom run db:local` in one terminal to start the DynamoDB including creation of the streams table and seed data.
- Run `npm run start` in a second terminal to start the lambda locally.
- Run `npm run cucumber` in a third terminal to run the end to end tests.

The e2e tests will test the _/streams/check_ endpoint invoking all possible outcomes.
A bash script has been prxovided in the _./bin/_ directory named run\_e2e.sh to include the ability to run the e2e tests as a single command within a CI/CD pipeline.

## Linting

The project has been setup with a linter. The linter config exists in the _.eslint.js_ file and can be run via the following command.

### Using npm

- Run `npm run lint`

### Using yarn 

- Run `yarn lint`

The project has also been configured to run the linter on commit. The commit will not be successful if the linter fails.

## Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:

- `functions` - containing code base and configuration for the _/streams/check_ lambda function
- `libs` - containing shared code base between your lambdas (The code situated in this directory is shared code that's used to schafold the lambda functions)
- `factory` - contains ES6 classes that implement a static factory method
- `model` - containing all model classes
- `service` - containing all services providing functionality such as DAO interface

```
.
├── src
│   ├── functions               # Lambda configuration and source code folder
│   │   ├── hello
│   │   │   ├── handler.ts      # `check` lambda source code
│   │   │   ├── index.ts        # `check` lambda Serverless configuration
│   │   │
│   │   └── index.ts            # Import/export of all lambda configurations
│   │
│   └── libs                    # Lambda shared code
│       └── apiGateway.ts       # API Gateway specific helpers
│       └── handlerResolver.ts  # Sharable library for resolving lambda handlers
│       └── lambda.ts           # Lambda middleware
│
├── test
|   ├── e2e                     # E2E test directory containing cucumber step definitions and features
|   ├── unit                    # Unit test directory containing all unit test specs
|
├── package.json
├── .eslintignore               # eslint ignore file specifying which files/directories to exlcude
├── eslintrc.js                 # eslint config file
├── .nvmrc                      # nvm configuration file setting the required node version
├── cucumber.js                 # E2E test cucumber test config
├── jest.config.js              # Unit test Jest config
├── serverless.ts               # Serverless service file
├── tsconfig.json               # Typescript compiler configuration
├── streamSeed.json             # Local DynamoDB seed file
├── tsconfig.paths.json         # Typescript paths
└── webpack.config.js           # Webpack configuration
```

### 3rd party libraries

- [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts) - uses JSON-Schema definitions used by API Gateway for HTTP request validation to statically generate TypeScript types in your lambda's handler code base
- [middy](https://github.com/middyjs/middy) - middleware engine for Node.Js lambda. This template uses [http-json-body-parser](https://github.com/middyjs/middy/tree/master/packages/http-json-body-parser) to convert API Gateway `event.body` property, originally passed as a stringified JSON, to its corresponding parsed object
- [@serverless/typescript](https://github.com/serverless/typescript) - provides up-to-date TypeScript definitions for your `serverless.ts` service file
- [Pino](https://github.com/pinojs/pino) - A node.js logger that outputs structured JSON logging as well as specifying logging levels.
- [serverless-dynamodb-client](https://www.npmjs.com/package/serverless-dynamodb-client) - A library that allows the creation of an AWS DynamoDB client configured to hit a local endpoint if run locally. 
