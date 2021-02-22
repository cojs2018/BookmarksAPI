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

    const deleteParams = {
        TableName: table,
        Key: {
            tagId,
        },
    };

    return dynamodb.delete(deleteParams).promise()
        .then(() => {
            return {
                status: 200,
                message: `Tag ${tagId} deleted successfully`,
            }
        })
        .catch(reasonForError => {
            return {
                status: 500,
                message: reasonForError,
            }
        });
}