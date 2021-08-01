import color from 'cli-color';
import { expect } from 'chai';
import texts_app from '../js_texts/static_strings_app';

describe('scripts/js_texts/static_strings_app.js', () => {
    const all        = {};
    const duplicates = {};

    beforeAll(() => {
        texts_app.forEach((str) => {
            if (all[str]) {
                duplicates[str] = (duplicates[str] || 1) + 1;
            } else {
                all[str] = 1;
            }
        });
    });

    it('strings should not be duplicated', () => {
        expect(Object.keys(duplicates)).to.have.lengthOf(0);
    });

    afterAll(() => {
        const keys = Object.keys(duplicates);
        if (keys.length) {
            console.log(color.yellow('\tDuplicates:'));
            keys.forEach((key) => {
                console.log(color.red('\t  -'), color.yellow(`[${duplicates[key]}]`), `'${key}'`);
            });
        }
    });
});
