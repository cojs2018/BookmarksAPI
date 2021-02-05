const htmlMeta = require('html-metadata-parser');
const path = require('path');
const lambdaLocal = require('lambda-local');

const analyseBookmark = path.join(__dirname, '../../bookmarks-lambda-analyse/index');

describe('Analyse Bookmark', () => {
    it('is successful', () => {
        htmlMeta.parser = jest.fn()
            .mockReturnValueOnce(new Promise((resolve, reject) => {
                resolve({
                    meta: {
                        title: 'Article Title',
                        description: 'Article Description',
                    },
                    og: {
                        title: 'Article Title',
                        description: 'Article Description',
                        tags: ['tag1', 'tag2'],
                    },
                    images: [],
                });
            }));

        const eventParams = {
            path: 'http://www.articlearchive.com/article0',
        };

        lambdaLocal.execute({
            event: eventParams,
            lambdaPath: analyseBookmark,
            profilePath: '~/.aws/credentials',
            profileName: 'default',
            timeoutMs: 3000
        })
        .then(onfulfilled => {
            expect(onfulfilled.status).toStrictEqual(200);
        })
        .catch(onrejected => {
            expect(onrejected.status).not.toBeDefined();
        });
    });
});