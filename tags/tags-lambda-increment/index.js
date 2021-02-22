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

    const updateParams = {
        TableName: table,
        Key: {
            tagId,
        },
        UpdateExpression: 'set featured = featured + :increment',
        ExpressionAttributeValues: {
            ":increment": 1,
        }
    };

    return dynamodb.update(updateParams).promise()
        .then(() => {
            return {
                status: 200,
                message: `Tag ${tagId} updated successfully`,
            }
        })
        .catch(reasonForError => {
            return {
                status: 500,
                message: reasonForError,
            }
        });
}