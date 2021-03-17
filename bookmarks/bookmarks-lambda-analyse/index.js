const htmlMeta = require('html-metadata-parser');

exports.handler = async (event) => {
    const {
        path
    } = event;

    return htmlMeta.parser(path)
        .then(articleMetaData => {
            console.log(articleMetaData);

            const {
                meta,
                og,
                images
            } = articleMetaData;

            let tags = [];
            if(og.tags) {
                tags = og.tags;
            }

            return {
                status: 200,
                message: 'Analysed article successfully',
                body: {
                    title: og.title,
                    description: og.description,
                    tags,
                    images,
                },
            };
        })
        .catch(reasonForError => {
            return {
                status: 500,
                message: reasonForError,
            }
        });
};