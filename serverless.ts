import type { AWS } from '@serverless/typescript';

import check from '@functions/check';

const serverlessConfiguration: AWS = {
  service: 'video-stream-regulator',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    dynamodb: {
      stages: ['dev'],
      start: {
        port: "8000",
        inMemory: true,
        migration: true
      },
      seed: {
        dev: {
          sources: [{
            table: "${self:provider.environment.DYNAMODB_TABLE}",
            sources: ['./streamSeed.json']
          }]
        }
      }
    }
  },
  plugins: ['serverless-webpack', 'serverless-offline', 'serverless-dynamodb-local'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      LOG_LEVEL: 'warn',
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      DYNAMODB_TABLE: 'streams',
      MAX_STREAMS: '3'
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [{
      Effect: 'Allow',
      Action: [
        'dynamodb:Query',
        'dynamodb:GetItem',
        'dynamodb:PutItem',
        'dynamodb:UpdateItem',
        'dynamodb:DeleteItem'
      ],
      Resource: 'arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/${self:provider.environment.DYNAMODB_TABLE}'
    }]
  },
  functions: { check },
  resources: {
    Resources: {
      streamsTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: "${self:provider.environment.DYNAMODB_TABLE}",
          AttributeDefinitions: [{
            AttributeName: 'streamId',
            AttributeType: 'S'
          },
          {
            AttributeName: 'userId',
            AttributeType: 'S'
          }],
          KeySchema:[{
            AttributeName: 'streamId',
            KeyType: 'HASH'
          }],
          GlobalSecondaryIndexes:[
            {
              IndexName: "streamUser",
              KeySchema:[{
                AttributeName: 'userId',
                KeyType: 'HASH'
              }],
              Projection: {
                ProjectionType: 'ALL'
              },
              ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
              }
            }
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          }
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
