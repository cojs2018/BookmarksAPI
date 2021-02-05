const AWS = require('aws-sdk');

const documentdb = new AWS.DynamoDB.DocumentClient();

AWS.config.update({
    region: process.env.REGION,
});

exports.handler = async (event) => {
    const {
        params,
    } = event;
    
    const {
        bookmarkId,
    } = params.path;

    const deleteParams = {
        TableName = process.env.TABLE_NAME,
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
}