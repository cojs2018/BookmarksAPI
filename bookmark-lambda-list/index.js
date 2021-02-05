const AWS = require('aws-sdk');

const documentdb = new AWS.DynamoDB.DocumentClient();

AWS.config.update({
    region: process.env.REGION,
});

exports.handler = async (event) => {
    const queryParams = {
        TableName = process.env.TABLE_NAME,
    };

    return documentdb.query(queryParams).promise()
        .then(resolvedBookmarkRequest => {
            return {
                status: 200,
                message: `${resolvedBookmarkRequest.Items.length} bookmark found`,
                Items: resolvedBookmarkRequest.Items,
            };
        })
        .catch(reasonForError => {
            return {
                status: 500,
                message: reasonForError,
            };
        });
}