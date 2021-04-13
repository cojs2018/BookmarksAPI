const AWS = require('aws-sdk');
const path = require('path');
const lambdaLocal = require('lambda-local');

const lambda = AWS.Lambda.prototype;

const updateTag = path.join(__dirname, '../../../tags/tags-lambda-update/index');

describe('Update Tag', () => {
    it('Successfully increments', () => {
        const eventParams = {
            tag: {
                tagId: 'fec999c8-1736-48ba-d17a-ad63a02d3657',
            },
            change: 'increment',
        };

        lambda.invoke = jest.fn()
            .mockReturnValue(AWS.Request.prototype);

        AWS.Request.prototype.promise = jest.fn()
            .mockReturnValueOnce(new Promise((resolve, reject) => {
                resolve({
                    Payload: JSON.stringify({
                        status: 200,
                        message: `Tag ${eventParams.tag.tagId} found!`,
                        Item: {
                            tagId: 'fec999c8-1736-48ba-d17a-ad63a02d3657',
                            value: 'Software Testing',
                            featured: 1,
                        }
                    })
                });
            }))
            .mockReturnValueOnce(new Promise((resolve, reject) => {
                resolve({
                    Payload: JSON.stringify({
                        status: 200,
                        message: `Tag ${eventParams.tag.tagId} incremented successfully!`,
                    })
                })
            }));

        lambdaLocal.execute({
            event: eventParams,
            lambdaPath: updateTag,
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
    })

    it('Successfully decrements', () => {
        const eventParams = {
            tag: {
                tagId: 'fec999c8-1736-48ba-d17a-ad63a02d3657',
            },
            change: 'decrement',
        };

        lambda.invoke = jest.fn()
            .mockReturnValue(AWS.Request.prototype);

        AWS.Request.prototype.promise = jest.fn()
            .mockReturnValueOnce(new Promise((resolve, reject) => {
                resolve({
                    Payload: JSON.stringify({
                        status: 200,
                        message: `Tag ${eventParams.tag.tagId} found!`,
                        Item: {
                            tagId: 'fec999c8-1736-48ba-d17a-ad63a02d3657',
                            value: 'Software Testing',
                            featured: 2,
                        }
                    })
                });
            }))
            .mockReturnValueOnce(new Promise((resolve, reject) => {
                resolve({
                    Payload: JSON.stringify({
                        status: 200,
                        message: `Tag ${eventParams.tag.tagId} incremented successfully!`,
                    })
                })
            }));

        lambdaLocal.execute({
            event: eventParams,
            lambdaPath: updateTag,
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
    })

    it('Successfully creates', () => {
        const eventParams = {
            tag: {
                value: 'Software Testing'
            },
            change: 'increment',
        };

        lambda.invoke = jest.fn()
            .mockReturnValue(AWS.Request.prototype);

        AWS.Request.prototype.promise = jest.fn()
            .mockReturnValueOnce(new Promise((resolve, reject) => {
                reject({
                    Payload: JSON.stringify({
                        status: 500,
                        message: `Tag not found!`
                    })
                });
            }))
            .mockReturnValueOnce(new Promise((resolve, reject) => {
                resolve({
                    Payload: JSON.stringify({
                        status: 200,
                        message: `Tag created successfully!`,
                        Item: {
                            tagId: 'fec999c8-1736-48ba-d17a-ad63a02d3657',
                            value: 'Software Testing',
                            featured: 1,
                        }
                    })
                })
            }));

        lambdaLocal.execute({
            event: eventParams,
            lambdaPath: updateTag,
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

    it('Successfully deletes', () => {
        const eventParams = {
            tag: {
                tagId: 'fec999c8-1736-48ba-d17a-ad63a02d3657',
            },
            change: 'decrement',
        };

        lambda.invoke = jest.fn()
            .mockReturnValue(AWS.Request.prototype);

        AWS.Request.prototype.promise = jest.fn()
            .mockReturnValueOnce(new Promise((resolve, reject) => {
                resolve({
                    Payload: JSON.stringify({
                        status: 200,
                        message: `Tag ${eventParams.tag.tagId} found!`,
                        Item: {
                            tagId: 'fec999c8-1736-48ba-d17a-ad63a02d3657',
                            value: 'Software Testing',
                            featured: 1,
                        }
                    })
                });
            }))
            .mockReturnValueOnce(new Promise((resolve, reject) => {
                resolve({
                    Payload: JSON.stringify({
                        status: 200,
                        message: `Tag ${eventParams.tag.tagId} deleted successfully!`,
                    })
                })
            }));

        lambdaLocal.execute({
            event: eventParams,
            lambdaPath: updateTag,
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
    })

    it('Decrement / No Item found', () => {
        const eventParams = {
            tag: {
                tagId: 'fec999c8-1736-48ba-d17a-ad63a02d3657',
            },
            change: 'decrement',
        };

        lambda.invoke = jest.fn()
            .mockReturnValue(AWS.Request.prototype);

        AWS.Request.prototype.promise = jest.fn()
            .mockReturnValueOnce(new Promise((resolve, reject) => {
                reject({
                    Payload: JSON.stringify({
                        status: 500,
                        message: `Tag not found!`
                    })
                });
            }))

        lambdaLocal.execute({
            event: eventParams,
            lambdaPath: updateTag,
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
    })
});