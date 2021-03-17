const AWS = require('aws-sdk');
const path = require('path');
const lambdaLocal = require('lambda-local');

const dynamodb = AWS.DynamoDB.DocumentClient.prototype;
const lambda = AWS.Lambda.prototype;

const deleteBookmark = path.join(__dirname, '../../../bookmarks/bookmarks-lambda-delete/index');

describe('Delete bookmark', () => {
    it('is successful', () => {
        const bookmarkId = 'e3742c48-c2a9-29ab-bff7-ed3863da2115';

        lambda.invoke = jest.fn()
            .mockReturnValue(AWS.Request.prototype);

        dynamodb.delete = jest.fn()
            .mockReturnValueOnce(AWS.Request.prototype);

        AWS.Request.prototype.promise = jest.fn()
            .mockReturnValueOnce(new Promise((resolve, reject) => {
                resolve({
                    Payload: JSON.stringify({
                        bookmarkId,
                        Item: {
                            tags: [
                                {
                                    value: 'tag1'
                                },
                                {
                                    value: 'tag2'
                                }
                            ]
                        }
                    })
                });
            }))
            .mockReturnValueOnce(new Promise((resolve, reject) => {
                resolve({
                    Payload: JSON.stringify({
                        status: 200,
                        message: "Tag decremented successfully"
                    })
                });
            }))
            .mockReturnValueOnce(new Promise((resolve, reject) => {
                resolve({
                    Payload: JSON.stringify({
                        status: 200,
                        message: "Tag decremented successfully"
                    })
                });
            }))
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