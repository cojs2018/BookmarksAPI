const AWS = require('aws-sdk');

AWS.config.update({
    region: process.env.REGION,
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const lambda = new AWS.Lambda();

const createTag = async (event) => {
    const invokeParams = {
        FunctionName: process.env.CREATE_TAG_FN,
        Payload: JSON.stringify(event),
    };

    return lambda.invoke(invokeParams).promise()
        .then(invocationResult => {
            return JSON.parse(invocationResult.Payload);
        })
        .catch(reasonForError => reasonForError);
};

const decrementTag = async (event) => {
    const invokeParams = {
        FunctionName: process.env.DECREMENT_TAG_FN,
        Payload: JSON.stringify(event),
    };

    return lambda.invoke(invokeParams).promise()
        .then(invocationResult => {
            return JSON.parse(invocationResult.Payload);
        })
        .catch(reasonForError => reasonForError);
};

const incrementTag = async (event) => {
    const invokeParams = {
        FunctionName: process.env.INCREMENT_TAG_FN,
        Payload: JSON.stringify(event),
    };

    return lambda.invoke(invokeParams).promise()
        .then(invocationResult => {
            return JSON.parse(invocationResult.Payload);
        })
        .catch(reasonForError => reasonForError);
};

exports.handler = async (event) => {
    const {
        params,
    } = event;

    const {
        bookmarkId,
    } = params.path;

    const {
        oldTags,
        newTags,
    } = event["body-json"];

    const removedTags = oldTags.filter(tag => !newTags.includes(tag));
    const addedTags = newTags.filter(tag => !oldTags.includes(tag));
    const unchangedTags = newTags.filter(tag => oldTags.includes(tag));

    const removalPromises = removedTags.map(tagEvent => decrementTag(tagEvent));
    const additionPromises = addedTags.map(tagEvent => {
        if(tagEvent.tagId) return incrementTag(tagEvent);
        return createTag(tagEvent);
    });

    return Promise.all([].concat(removalPromises, additionPromises))
        .then(allPromisedResults => {

            const updatedTagSet = allPromisedResults
                .map(result => result.Item)
                .concat(unchangedTags);

            let updateParams = {
                TableName: process.env.TABLE_NAME,
                Key: {
                    bookmarkId,
                },
                UpdateExpression: 'set tags = :tags',
                ExpressionAttributeValues: {
                    ':tags': updatedTagSet,
                },
            };

            return dynamodb.update(updateParams).promise()
                .then(() => {
                    return {
                        status: 200,
                        message: `Bookmark ${bookmarkId} updated`,
                    };
                })
                .catch(reasonForError => {
                    return {
                        status: 500,
                        message: reasonForError,
                    };
                });
        })
        .catch(reasonForError => {
            return {
                status: 500,
                message: reasonForError,
            };
        });
};