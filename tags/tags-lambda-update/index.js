const AWS = require('aws-sdk');

const lambda = new AWS.Lambda();

const region = process.env.REGION;

AWS.config.update({
    region,
});

const invokeCreateTag = async (inputTag) => {
    const payload = {
        tag: inputTag,
    };

    const invocationParams = {
        FunctionName: process.env.CREATE_TAG_FN,
        Payload: JSON.stringify(payload),
    };

    return lambda.invoke(invocationParams).promise()
        .then(invocationResult => {
            return JSON.parse(invocationResult.Payload);
        })
        .catch(reasonForError => JSON.parse(reasonForError.Payload));
}

const invokeIncrementTag = async (inputTag) => {
    const payload = {
        tag: inputTag,
    };

    const invocationParams = {
        FunctionName: process.env.INCREMENT_TAG_FN,
        Payload: JSON.stringify(payload),
    };

    return lambda.invoke(invocationParams).promise()
        .then(invocationResult => {
            return JSON.parse(invocationResult.Payload);
        })
        .catch(reasonForError => JSON.parse(reasonForError.Payload));
}

const invokeDeleteTag = async (inputTag) => {
    const payload = {
        tag: inputTag,
    };

    const invocationParams = {
        FunctionName: process.env.DELETE_TAG_FN,
        Payload: JSON.stringify(payload),
    };

    return lambda.invoke(invocationParams).promise()
        .then(invocationResult => {
            return JSON.parse(invocationResult.Payload);
        })
        .catch(reasonForError => JSON.parse(reasonForError.Payload));
}

const invokeDecrementTag = async (inputTag) => {
    const payload = {
        tag: inputTag,
    };

    const invocationParams = {
        FunctionName: process.env.DECREMENT_TAG_FN,
        Payload: JSON.stringify(payload),
    };

    return lambda.invoke(invocationParams).promise()
        .then(invocationResult => {
            return JSON.parse(invocationResult.Payload);
        })
        .catch(reasonForError => JSON.parse(reasonForError.Payload));
}

const invokeGetTag = async (inputTag) => {
    const payload = {
        tag: inputTag,
    };

    const invocationParams = {
        FunctionName: process.env.GET_TAG_FN,
        Payload: JSON.stringify(payload),
    };

    return lambda.invoke(invocationParams).promise()
        .then(invocationResult => {
            return JSON.parse(invocationResult.Payload);
        })
        .catch(reasonForError => JSON.parse(reasonForError.Payload));
}

exports.handler = async (event) => {
    const {
        tag,
        change,
    } = event;

    if (change === 'increment') {
        return invokeGetTag(tag)
            .then(getResult => {
                const foundTag = getResult.Item;
                return invokeIncrementTag(foundTag)
                    .then(incrementResult => incrementResult)
                    .catch(reasonForError => reasonForError);
            })
            .catch(error => {
                console.log(error);
                return invokeCreateTag(tag)
                .then(createResult => createResult)
                .catch(reasonForError => reasonForError);
            });
    }
    else if(change === 'decrement') {
        return invokeGetTag(tag)
            .then(getResult => {

                if(getResult.status !== 200) throw new Error(resultPayload);

                const foundTag = getResult.Item;
                if(foundTag.featured > 1) {
                    return invokeDecrementTag(foundTag)
                        .then(decrementResult => decrementResult)
                        .catch(reasonForError => reasonForError);
                }

                return invokeDeleteTag(foundTag)
                    .then(deleteTag => deleteTag)
                    .catch(reasonForError => reasonForError);
            })
            .catch(reasonForError => reasonForError);
    }
}