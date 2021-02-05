const AWS = require('aws-sdk');
const path = require('path');
const lambdaLocal = require('lambda-local');

const dynamodb = AWS.DynamoDB.DocumentClient.prototype;

const getBookmark = path.join(__dirname, '../../bookmarks-lambda-get/index');

describe('Get bookmark', () => {
    it('is successful', () => {
        const bookmarkId = 'y6909djs8djFks9';

        dynamodb.get = jest.fn()
            .mockReturnValueOnce(AWS.Request.prototype);

        AWS.Request.prototype.promise = jest.fn()
            .mockReturnValueOnce(new Promise((resolve, reject) => {
                resolve({
                    Item: {
                        bookmarkId,
                        articleName: "article0 - articlearchive",
                        path: 'http://www.articlearchive.com/article0',
                        url: new URL('http://www.articlearchive.com/article0').toJSON(),
                        createdAt: (new Date()).toUTCString(),
                        title: 'Article title',
                        description: 'Description',
                        tags: ['tag1', 'tag2'],
                        images: []
                    },
                });
            }));

        const eventParams = {
            params: {
                path: { bookmarkId },
            }
        }

        lambdaLocal.execute({
            event: eventParams,
            lambdaPath: getBookmark,
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