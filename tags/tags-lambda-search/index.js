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

const search = async (searchQuery, count) => {
    return 'Search pending';
}

exports.handler = async (event) => {
    const {
        numberOfTags,
        count,
    } = event

    return invokeList()
        .then(allTagsPayload => {
            const alltags = allTagsPayload.Items;

            const searchRequest = alltags
                .sort((tag1, tag2) => tag2.featured - tag1.featured)
                .slice(0, numberOfTags)
                .map(tag => `"${tag.value}"`)
                .toString()
                .replaceAll(',', ' ');
                

            return search(searchRequest, count)
                .then(links => {
                    return {
                        status: 200,
                        links,
                    }
                });
        })
        .catch(reasonForError => ({
            status: 500,
            message: reasonForError,
        }));
};