const AWS = require('aws-sdk');
const path = require('path');
const lambdaLocal = require('lambda-local');

const dynamodb = AWS.DynamoDB.DocumentClient.prototype;

const deleteTag = path.join(__dirname, '../../../tags/tags-lambda-delete/index');

describe('Delete tags', () => {
    it('is successful', () => {

        dynamodb.delete = jest.fn()
            .mockReturnValueOnce(AWS.Request.prototype);

        AWS.Request.prototype.promise = jest.fn()
            .mockReturnValueOnce(new Promise((resolve, reject) => {
                resolve({});
            }))

        const eventParams = {
            tagId: 'fec999c8-1736-48ba-d17a-ad63a02d3657',
        }

        lambdaLocal.execute({
            event: eventParams,
            lambdaPath: deleteTag,
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