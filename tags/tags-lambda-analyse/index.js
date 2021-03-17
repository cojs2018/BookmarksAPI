const AWS = require('aws-sdk');

const region = process.env.REGION;

AWS.config.update({
    region,
});

const lambda = new AWS.Lambda();

const invokeList = async () => {
    const invocationParams = {
        FunctionName: process.env.LIST_TAGS_FN,
        Payload: "{}",
    };

    return lambda.invoke(invocationParams).promise()
        .then(invocationResult => {
            return JSON.parse(invocationResult.Payload);
        })
        .catch(reasonForError => reasonForError);
};

exports.handler = async () => {
    return invokeList()
        .then(allTagsPayload => {
            const alltags = allTagsPayload.Items;

            const sortedTagValues = alltags
                .sort((tagA, tagB) => tagB.featured - tagA.featured)
                .map(tag => tag.value);

            const searchString = sortedTagValues
                .map(tag => tag.replace(' ', '+'))
                .toString()
                ''.

            console.log(searchString);

            return {
                status: 200,
                searchCriteria: `"${
                    sortedTagValues
                        .toString()
                        .replace(',', '"+"')
                }"`,
            }
        })
        .catch(reasonForError => ({
            status: 500,
            message: reasonForError,
        }));
};