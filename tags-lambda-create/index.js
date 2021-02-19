const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const table = process.env.TABLE_NAME;
const region = process.env.REGION;

AWS.config.update({
    region,
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const {
        value
    } = event;

    const newTagItem = {
        tagId: uuidv4(),
        value,
        featured: 1,
    };

    const putParams = {
        TableName: table,
        Item: newTagItem,
    };

    return dynamodb.put(putParams).promise()
        .then(() => {
            return {
                status: 200,
                message: 'Tags successfully added to database',
                Item: {
                    ...newTagItem,
                },
            }
        })
        .catch(reasonForError => {
            return {
                status: 500,
                message: reasonForError,
            }
        });
}