const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamodb = new AWS.DynamoDB.DocumentClient();

const table = process.env.TABLE_NAME;
const region = process.env.REGION;

AWS.config.update({
    region,
});

exports.handler = async (event) => {
    const {
        body
    } = event;

    const {
        articleName,
        path,
        url,
    } = body;

    const bookmarkId = uuidv4();
    const createdAt = (new Date()).toUTCString();

    const putParams = {
        TableName: table,
        Item: {
            bookmarkId,
            articleName,
            path,
            url,
            createdAt,
        }
    };

    return dynamodb.put(putParams).promise()
        .then(() => {
            return {
                status: 200,
                message: 'Bookmark successfully added to database',
                body: putParams.Item,
            }
        })
        .catch(reasonForError => {
            return {
                status: 500,
                message: reasonForError,
            }
        })
}