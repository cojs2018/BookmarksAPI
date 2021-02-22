jest.mock('uuid')

const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const lambdaLocal = require('lambda-local');

const dynamodb = AWS.DynamoDB.DocumentClient.prototype;
const lambda = AWS.Lambda.prototype;

const createBookmark = path.join(__dirname, '../../../bookmarks/bookmarks-lambda-create/index');

describe('Create bookmark', () => {
    it('is successful', () => {
        uuidv4.mockReturnValueOnce('e3742c48-c2a9-29ab-bff7-ed3863da2115');

        dynamodb.put = jest.fn()
            .mockReturnValueOnce(AWS.Request.prototype);

        lambda.invoke = jest.fn()
            .mockReturnValueOnce(AWS.Request.prototype);

        AWS.Request.prototype.promise = jest.fn()
            .mockReturnValueOnce(new Promise((resolve, reject) => {
                resolve({
                    Payload: JSON.stringify({
                        body: {
                            title: 'Article title',
                            description: 'Description',
                            tags: ['tag1', 'tag2'],
                            images: []
                        },
                    }),
                });
            }))
            .mockReturnValueOnce(new Promise((resolve, reject) => {
                resolve({});
            }));

        const eventParams = {
            body: {
                articleName: "article0 - articlearchive",
                path: 'http://www.articlearchive.com/article0',
                url: new URL('http://www.articlearchive.com/article0').toJSON(),
            }
        }

        lambdaLocal.execute({
            event: eventParams,
            lambdaPath: createBookmark,
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

