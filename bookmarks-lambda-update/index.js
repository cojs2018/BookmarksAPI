const AWS = require('aws-sdk');

AWS.config.update({
    region: process.env.REGION,
});

const documentdb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const {
        params,
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

    const body = event["body-json"];

    const expressionsToConcat = Object.keys(body).map((key, i) => {
        let newExpression = `${key} = :${key}`;
        if(i <  Object.keys(body).length-1) {
            newExpression = newExpression + ',';
        }
        updateParams.ExpressionAttributeValues[`:${key}`] = body[key];
        return newExpression;
    });

    updateParams.UpdateExpression = updateParams.UpdateExpression.concat(expressionsToConcat);

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
};