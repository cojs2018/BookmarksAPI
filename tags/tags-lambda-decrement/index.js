const AWS = require('aws-sdk');

const table = process.env.TABLE_NAME;
const region = process.env.REGION;

AWS.config.update({
    region,
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const lambda = new AWS.Lambda();

const invokeDelete = async (event) => {
    const invocationParams = {
        FunctionName: process.env.DELETE_FN,
        Payload: JSON.stringify(event),
    };

    return lambda.invoke(invocationParams).promise()
        .then(invocationResult => {
            return JSON.parse(invocationResult.Payload);
        })
        .catch(reasonForError => reasonForError);
}

exports.handler = async (event) => {
    const {
        tagId
    } = event;

    const updateParams = {
        TableName: table,
        Key: {
            tagId,
        },
        UpdateExpression: 'set featured = featured + :decrement',
        ConditionExpression: 'featured > :lowerBound',
        ExpressionAttributeValues: {
            ":decrement": -1,
            ":lowerBound": 1,
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
            if (reasonForError.code === "ConditionalCheckFailedException") {
                console.info('Lower bound reached: deleting tag...');
                
                return invokeDelete(event);
            }

            return {
                status: 500,
                message: reasonForError,
            }
        });
};