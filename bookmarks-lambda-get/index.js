const AWS = require('aws-sdk');

const documentdb = new AWS.DynamoDB.DocumentClient();

const table = process.env.TABLE_NAME;
const region = process.env.REGION;

AWS.config.update({
    region,
});

exports.handler = async (event) => {
    const {
        params,
    } = event;

    const {
        bookmarkId,
    } = params.path;

    const getParams = {
        TableName: table,
        Key: {
            bookmarkId,
        },
    };

    return documentdb.get(getParams).promise()
        .then(resolvedBookmarkRequest => {
            return {
                status: 200,
                message: `Bookmark ${bookmarkId} found`,
                Item: resolvedBookmarkRequest.Item,
            };
        })
        .catch(reasonForError => {
            return {
                status: 500,
                message: reasonForError,
            };
        });
}