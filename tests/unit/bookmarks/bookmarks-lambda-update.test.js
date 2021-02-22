const AWS = require('aws-sdk');
const path = require('path');
const lambdaLocal = require('lambda-local');

const dynamodb = AWS.DynamoDB.DocumentClient.prototype;

const updateBookmark = path.join(__dirname, '../../../bookmarks/bookmarks-lambda-update/index');

describe('Update bookmark', () => {
    it('is successful', () => {
        const bookmarkId = 'e3742c48-c2a9-29ab-bff7-ed3863da2115';

        dynamodb.update = jest.fn()
            .mockReturnValueOnce(AWS.Request.prototype);

        AWS.Request.prototype.promise = jest.fn()
            .mockReturnValueOnce(new Promise((resolve, reject) => {
                resolve({});
            }));

        const eventParams = {
            params: {
                path: { bookmarkId },
            },
            body: {
                images: [{
                    imageUrl: 'http://www.articlearchive.com/article0/image0',
                    "size (px)": { height: 512, width: 512 },
                    "size (kB)": 512,
                }],
            },
        };

        lambdaLocal.execute({
            event: eventParams,
            lambdaPath: updateBookmark,
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