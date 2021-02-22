jest.mock('uuid');
jest.mock('aws-sdk');

const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const lambdaLocal = require('lambda-local');

const dynamodb = AWS.DynamoDB.DocumentClient.prototype;

const createTag = path.join(__dirname, '../../../tags/tags-lambda-create/index');

describe('Create tag', () => {
    it('is successful', () => {
        uuidv4.mockReturnValueOnce('fec999c8-1736-48ba-d17a-ad63a02d3657');

        dynamodb.put = jest.fn()
            .mockReturnValueOnce(AWS.Request.prototype);

        AWS.Request.prototype.promise = jest.fn()
            .mockReturnValueOnce(new Promise((resolve, reject) => {
                resolve({});
            }))

        const eventParams = {
            value: "Software testing",
        }

        lambdaLocal.execute({
            event: eventParams,
            lambdaPath: createTag,
            profilePath: '~/.aws/credentials',
            profileName: 'default',
            timeoutMs: 3000
        })
        .then(onfulfilled => {
            expect(onfulfilled.status).toStrictEqual(200);
        })
        .catch(onrejected => {
            expect(onrejected.status).not.toBeDefined();
        });
    });
});