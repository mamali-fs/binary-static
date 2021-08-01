import {expect} from 'chai';
import { setURL } from './tests_common';
import { websiteUrl,param, paramsHash, urlFor,urlForStatic, resetStaticHost } from "../url";

const urls = [
    'https://www.binary.com',
    'https://www.binary.me',
];

function mockLocation(url) {
    return setURL(url);
}

describe.each(urls)('Url -> %s', (url) => {
    let home_url, website_url, query_string, params_obj, url_no_qs, url_with_qs;
    let window_location;
    beforeAll(() => {
        window_location = mockLocation(url);

        /*
         Pre defined values
         */
        website_url = websiteUrl();
        home_url = `${website_url}en/home.html`;
        query_string = 'market=forex&duration_amount=5&no_value=';
        params_obj = { market: 'forex', duration_amount: '5', no_value: '' };
        url_no_qs = `${website_url}en/trading.html`;
        url_with_qs = `${url_no_qs}?${query_string}`;
    });
    afterAll(() => {
        window.location = window_location;
    });

    it('assert websiteUrl is working', () => {
        expect(websiteUrl()).to.eq(`${url}/`);
    });
    it('assert mocking globals is working', () => {
        const fqdn = url.replace('https://', '');
        expect(window.location.hostname).to.be.eq(fqdn);
        expect(location.hostname).to.be.eq(fqdn);
        expect(window.location.href).to.be.eq(websiteUrl());
    });
    describe('.urlFor()', () => {
        it('returns home as default', () => {
            [undefined, null, '', '/', 'home'].forEach(path => {
                expect(urlFor(path)).to.eq(home_url);
            });
        });
        it('accepts params', () => {
            expect(
                urlFor('trading', {
                    query_string,
                })
            ).to.eq(url_with_qs);
        });
        it('returns the correct language', () => {
            expect(urlFor('home', undefined, 'es')).to.eq(`${website_url}es/home.html`);
        });
        it('ignores invalid characters', () => {
            expect(urlFor('`~!@#$%^&*=+[}{]\\"\';:?><,|')).to.eq(home_url);
        });
        it('handles all valid characters', () => {
            expect(urlFor('metatrader/comparison-4_vs_5')).to.eq(
                `${website_url}en/metatrader/comparison-4_vs_5.html`
            );
        });
    });
    describe('.paramsHash()', () => {
        it('returns correct object', () => {
            expect(paramsHash(url_with_qs))
                .to.be.an('Object')
                .and.to.have.all.keys('market', 'duration_amount', 'no_value')
                .and.to.deep.equal(params_obj);
        });
        it('returns empty object when there is no query string', () => {
            expect(paramsHash(url_no_qs)).to.be.an('Object').and.to.deep.equal({});
            expect(paramsHash(`${url_no_qs}?`))
                .to.be.an('Object')
                .and.to.deep.equal({});

            expect(paramsHash()).to.deep.eq({});
        });
    });
    describe('.urlForStatic()', () => {
        beforeEach(() => {
            resetStaticHost();
        });

        it('returns base path as default', () => {
            expect(urlForStatic()).to.eq(website_url);
        });
        it('returns expected path', () => {
            expect(urlForStatic('images/common/plus.svg')).to.eq(`${website_url}images/common/plus.svg`);
        });
    });

    describe('.param()', () => {
        beforeEach(() => {
            mockLocation(url_with_qs);
        });
        it('returns undefined if no match', () => {
            expect(param()).to.eq(undefined);
        });
        it('returns expected parameter', () => {
            expect(param('duration_amount')).to.be.a('string').and.eq('5');
            expect(param('no_value')).to.be.a('string').and.eq('');
        });
    });

    describe('.websiteUrl()', () => {
        it('returns expected value', () => {
            expect(websiteUrl()).to.eq(`${url}/`);
        });
    });
})

