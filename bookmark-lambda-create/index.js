const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const lambda = new AWS.Lambda();

const table = process.env.TABLE_NAME;
const region = process.env.REGION;

AWS.config.update({
    region,
});

const analyseBookmark = async (path) => {
    const payload = {
        path,
    };

    const invokeParams = {
        FunctionName: process.env.ANALYSER,
        Payload: payload,
    };

    return lambda.invoke(invokeParams).promise();
}

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

    return analyseBookmark(path)
        .then(onfulfilled => {
            const {
                title,
                description,
                tags,
                images
            } = onfulfilled.Payload.body;

            const putParams = {
                TableName: table,
                Item: {
                    bookmarkId,
                    articleName,
                    path,
                    url,
                    createdAt,
                    title,
                    description,
                    tags,
                    images,
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
                });
        })
}