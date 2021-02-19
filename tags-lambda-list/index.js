const AWS = require('aws-sdk');

const table = process.env.TABLE_NAME;
const region = process.env.REGION;

AWS.config.update({
    region,
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async () => {

    const scanParams = {
        TableName: table,
        Select: 'ALL_ATTRIBUTES',
    };

    return dynamodb.scan(scanParams).promise()
        .then(resolveedTagsRequest => {
            return {
                status: 200,
                message: `${resolveedTagsRequest.Items.length} Tags found`,
                Items: [ ...resolveedTagsRequest.Items ],
            }
        })
        .catch(reasonForError => {
            return {
                status: 500,
                message: reasonForError,
            }
        });
}