const AWS = require('aws-sdk');

const documentdb = new AWS.DynamoDB.DocumentClient();

AWS.config.update({
    region: process.env.REGION,
});

exports.handler = async (event) => {
    const {
        params,
        body,
    } = event;

    const {
        bookmarkId,
    } = params.path;

    let updateParams = {
        TableName: process.env.TABLE_NAME,
        Key: {
            bookmarkId,
        },
        UpdateExpression: 'set ',
        ExpressionAttributeValues: {
        },
    };

    const expressionsToConcat = Object.keys(body).map((key, i) => {
        let newExpression = `${key} = :${key}`;
        if(i <  Object.keys(body).length) {
            newExpression = newExpression + ',';
        }
        updateParams.ExpressionAttributeValues[`:${key}`] = body[key];
        return newExpression;
    });

    updateParams.UpdateExpression.concat(expressionsToConcat);

    return documentdb.update(updateParams).promise()
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
}