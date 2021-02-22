const AWS = require('aws-sdk');
const path = require('path');
const lambdaLocal = require('lambda-local');

const dynamodb = AWS.DynamoDB.DocumentClient.prototype;

const listTag = path.join(__dirname, '../../../tags/tags-lambda-list/index');

describe('List tags', () => {
    it('is successful', () => {

        dynamodb.scan = jest.fn()
            .mockReturnValueOnce(AWS.Request.prototype);

        AWS.Request.prototype.promise = jest.fn()
            .mockReturnValueOnce(new Promise((resolve, reject) => {
                resolve({
                    Items: [
                        {
                            tagId: 'fec999c8-1736-48ba-d17a-ad63a02d3657',
                            value: 'Software Testing',
                            featured: 1,
                        }
                    ]
                });
            }))

        const eventParams = {}

        lambdaLocal.execute({
            event: eventParams,
            lambdaPath: listTag,
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