const AWS = require('aws-sdk');
const path = require('path');
const lambdaLocal = require('lambda-local');

const dynamodb = AWS.DynamoDB.DocumentClient.prototype;
const lambda = AWS.Lambda.prototype;

const updateBookmark = path.join(__dirname, '../../../bookmarks/bookmarks-lambda-update/index');

describe('Update bookmark', () => {
    it('is successful', () => {
        const bookmarkId = 'e3742c48-c2a9-29ab-bff7-ed3863da2115';

        lambda.invoke = jest.fn()
            .mockReturnValue(AWS.Request.prototype);

        dynamodb.update = jest.fn()
            .mockReturnValueOnce(AWS.Request.prototype);
        
        AWS.Request.prototype.promise = jest.fn()
            .mockReturnValueOnce(new Promise((resolve, reject) => {
                resolve({
                    Payload: JSON.stringify({
                        status: 200,
                        message: `Tag ${'085e1b24-9cd3-3954-aee3-6f73256993cd'} updated successfully`,
                    })
                });
            }))
            .mockReturnValueOnce(new Promise((resolve, reject) => {
                resolve({
                    Payload: JSON.stringify({
                        status: 200,
                        message: `Tag ${'3ffea5a8-7080-fcc3-886f-7299a8f0c904'} updated successfully`,
                    })
                });
            }))
            .mockReturnValueOnce(new Promise((resolve, reject) => {
                resolve({
                    Payload: JSON.stringify({
                        status: 200,
                        message: `Tag ${'fec999c8-1736-48ba-d17a-ad63a02d3657'} created successfully`,
                        tagId: 'fec999c8-1736-48ba-d17a-ad63a02d3657',
                        value: 'Tag to be created',
                        featured: 1,
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
            ["body-json"]: {
                oldTags: [
                    {
                        tagId: '085e1b24-9cd3-3954-aee3-6f73256993cd',
                        value: 'Tag to be decremented',
                        featured: 2,
                    }
                ],
                newTags: [
                    {
                        tagId: '3ffea5a8-7080-fcc3-886f-7299a8f0c904',
                        value: 'Tag to be incremented',
                        featured: 1,
                    },
                    {
                        value: 'Tag to be created',
                    }
                ]
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