const AWS = require('aws-sdk');
const path = require('path');
const lambdaLocal = require('lambda-local');

const dynamodb = AWS.DynamoDB.DocumentClient.prototype;

const getTag = path.join(__dirname, '../../../tags/tags-lambda-get/index');

describe('Get tags', () => {
    it('is successful', () => {

        dynamodb.get = jest.fn()
            .mockReturnValueOnce(AWS.Request.prototype);

        AWS.Request.prototype.promise = jest.fn()
            .mockReturnValueOnce(new Promise((resolve, reject) => {
                resolve({
                    Item: {
                        tagId: 'fec999c8-1736-48ba-d17a-ad63a02d3657',
                        value: 'Software Testing',
                        featured: 1,
                    },
                });
            }))

        const eventParams = {
            tagId: 'fec999c8-1736-48ba-d17a-ad63a02d3657',
        }

        lambdaLocal.execute({
            event: eventParams,
            lambdaPath: getTag,
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