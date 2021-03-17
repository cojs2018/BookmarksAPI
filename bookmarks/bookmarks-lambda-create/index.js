const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const table = process.env.TABLE_NAME;
const region = process.env.REGION;

AWS.config.update({
    region,
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const lambda = new AWS.Lambda();

const analyseBookmark = async (path) => {
    const payload = {
        path,
    };

    const invokeParams = {
        FunctionName: process.env.ANALYSER,
        Payload: JSON.stringify(payload),
    };

    return lambda.invoke(invokeParams).promise();
}

const invokeUpdateTag = async (tag) => {
    const payload = {
        tag,
        change: "increment",
    };

    const invokeParams = {
        FunctionName: process.env.UPDATE_TAG_FN,
        Payload: JSON.stringify(payload),
    };

    return lambda.invoke(invokeParams).promise();
}

exports.handler = async (event) => {
    const {
        body
    } = event;

    const {
        articleName,
        path,
        url,
    } = body;

    const bookmarkId = uuidv4();
    const createdAt = (new Date()).toUTCString();

    return analyseBookmark(path)
        .then(onfulfilled => {
            const responsePayload = JSON.parse(onfulfilled.Payload);

            const {
                title,
                description,
                tags,
                images
            } = responsePayload.body;

            const createTagPromises = tags.map(async tag => {
                return invokeUpdateTag(tag);
            });

            return Promise.allSettled(createTagPromises)
                .then(allCreatedTags => {
                    const newTagSet = allCreatedTags
                        .map(result => result.Item);

                    const putParams = {
                        TableName: table,
                        Item: {
                            bookmarkId,
                            articleName,
                            path,
                            url,
                            createdAt,
                            title,
                            description,
                            tags: newTagSet,
                            images,
                        }
                    };
        
                    return dynamodb.put(putParams).promise()
                        .then(() => {
                            return {
                                status: 200,
                                message: 'Bookmark successfully added to database',
                                body: putParams.Item,
                            }
                        })
                        .catch(reasonForError => {
                            return {
                                status: 500,
                                message: reasonForError,
                            }
                        });
                })
                .catch(reasonforError => {
                    return {
                        status: 500,
                        message: reasonForError,
                    };
                });
        });
};