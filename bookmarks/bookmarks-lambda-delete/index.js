const AWS = require('aws-sdk');

AWS.config.update({
    region: process.env.REGION,
});

const documentdb = new AWS.DynamoDB.DocumentClient();
const lambda = new AWS.Lambda();

const invokeGetBookmark = async (bookmarkId) => {
    const payload = {
        params: {
            path: {
                bookmarkId,
            }
        }
    };

    const invokeParams = {
        FunctionName: process.env.GET_BOOKMARK_FN,
        Payload: JSON.stringify(payload),
    };

    return lambda.invoke(invokeParams).promise();
};

const invokeUpdateTag = async (tag) => {
    const payload = {
        tag,
        change: "decrement",
    };

    const invokeParams = {
        FunctionName: process.env.UPDATE_TAG_FN,
        Payload: JSON.stringify(payload),
    };

    return lambda.invoke(invokeParams).promise();
};

exports.handler = async (event) => {
    const {
        params,
    } = event;
    
    const {
        bookmarkId,
    } = params.path;

    return invokeGetBookmark(bookmarkId)
        .then(bookmarkResponse => {
            const tags = JSON.parse(bookmarkResponse.Payload)
                    .Item
                    .tags;

            const decrementTagPromises = tags.map(async tag => {
                return invokeUpdateTag(tag);
            });

            return Promise.allSettled(decrementTagPromises)
                .then(() => {
                    const deleteParams = {
                        TableName: process.env.TABLE_NAME,
                        Key: {
                            bookmarkId,
                        },
                    };

                    return documentdb.delete(deleteParams).promise()
                        .then(() => {
                            return {
                                status: 200,
                                message: `Bookmark ${bookmarkId} deleted`,
                            };
                        })
                        .catch(reasonForError => {
                            return {
                                status: 500,
                                message: reasonForError,
                            };
                        });
                })
                .catch(reasonForError => reasonForError);

        })
        .catch(reasonForError => reasonForError);
};