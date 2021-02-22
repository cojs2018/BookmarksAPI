const AWS = require('aws-sdk');

AWS.config.update({
    region: "eu-west-2" //process.env.REGION,
});

const documentdb = new AWS.DynamoDB.DocumentClient();

exports.handler = async () => {
    const queryParams = {
        TableName: "Bookmarks-Storage", //process.env.TABLE_NAME,
        Select: 'ALL_ATTRIBUTES'
    };

    return documentdb.scan(queryParams).promise()
        .then(resolvedBookmarkRequest => {
            return {
                status: 200,
                message: `${resolvedBookmarkRequest.Items.length} bookmarks found`,
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