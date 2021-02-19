const AWS = require('aws-sdk');

const table = process.env.TABLE_NAME;
const region = process.env.REGION;

AWS.config.update({
    region,
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const {
        tagId
    } = event;

    const getParams = {
        TableName: table,
        Key: {
            tagId,
        },
    };

    return dynamodb.get(getParams).promise()
        .then(resolvedTagRequest => {
            return {
                status: 200,
                message: `Tag ${tagId} found`,
                Item: resolvedTagRequest.Item,
            }
        })
        .catch(reasonForError => {
            return {
                status: 500,
                message: reasonForError,
            }
        });
}