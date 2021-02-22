const AWS = require('aws-sdk');
const path = require('path');
const lambdaLocal = require('lambda-local');

const dynamodb = AWS.DynamoDB.DocumentClient.prototype;
const lambda = AWS.Lambda.prototype;

const decrementTag = path.join(__dirname, '../../../tags/tags-lambda-decrement/index');

describe('Decrement tags', () => {
    it('is successful', () => {

        dynamodb.update = jest.fn()
            .mockReturnValueOnce(AWS.Request.prototype);

        AWS.Request.prototype.promise = jest.fn()
            .mockReturnValueOnce(new Promise((resolve, reject) => {
                resolve({});
            }));

        const eventParams = {
            tagId: 'fec999c8-1736-48ba-d17a-ad63a02d3657',
        }

        lambdaLocal.execute({
            event: eventParams,
            lambdaPath: decrementTag,
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

    it('is successful: lower bound reached', () => {

        dynamodb.update = jest.fn()
            .mockReturnValueOnce(AWS.Request.prototype);

        lambda.invoke = jest.fn()
            .mockReturnValueOnce(AWS.Request.prototype);

        AWS.Request.prototype.promise = jest.fn()
            .mockReturnValueOnce(new Promise((resolve, reject) => {
                reject({
                    code: "ConditionalCheckFailedException"
                })
            }))
            .mockReturnValueOnce(new Promise((resolve, reject) => {
                resolve(JSON.stringify({
                    status: 200,
                    message: `Tag ${tagId} deleted successfully`,
                }));
            }));

        const eventParams = {
            tagId: 'fec999c8-1736-48ba-d17a-ad63a02d3657',
        }

        lambdaLocal.execute({
            event: eventParams,
            lambdaPath: decrementTag,
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