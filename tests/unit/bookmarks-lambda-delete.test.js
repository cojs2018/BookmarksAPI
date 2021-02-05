const AWS = require('aws-sdk');
const path = require('path');
const lambdaLocal = require('lambda-local');

const dynamodb = AWS.DynamoDB.DocumentClient.prototype;

const deleteBookmark = path.join(__dirname, '../../bookmarks-lambda-delete/index');

describe('Delete bookmark', () => {
    it('is successful', () => {
        const bookmarkId = 'y6909djs8djFks9';

        dynamodb.delete = jest.fn()
            .mockReturnValueOnce(AWS.Request.prototype);

        AWS.Request.prototype.promise = jest.fn()
            .mockReturnValueOnce(new Promise((resolve, reject) => {
                resolve({});
            }));

        const eventParams = {
            params: {
                path: { bookmarkId },
            },
        };

        lambdaLocal.execute({
            event: eventParams,
            lambdaPath: deleteBookmark,
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
})