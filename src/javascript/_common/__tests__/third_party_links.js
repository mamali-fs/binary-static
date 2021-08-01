import { setURL } from './tests_common';
import { expect } from 'chai';
import AccountOpening from '../third_party_links';

describe.each([
    ['https://www.binary.com', 'binary.com'],
    ['https://www.binary.me', 'binary.me'],
    ['https://www.deriv.com', 'deriv.com'],
])('ThirdPartyLinks -> %s', (url, fqdn) => {
    let domain;
    beforeAll(() => {
        setURL(url);
        domain = url.replace(/^https:\/\/www\./, '');
    });
    test(`works for ${fqdn}`, () => {
        expect(AccountOpening.isThirdPartyLink(window.location.href)).to.equal(false);
    });
    test(`works for ${fqdn} subdomains`, () => {
        expect(AccountOpening.isThirdPartyLink(`https://www.style.${fqdn}`)).to.equal(false);
        expect(AccountOpening.isThirdPartyLink(`https://login.${fqdn}/signup.php?lang=0`)).to.equal(false);
    });
    test('works for special values', () => {
        expect(AccountOpening.isThirdPartyLink('javascript:;')).to.equal(false);
        expect(AccountOpening.isThirdPartyLink('#')).to.equal(false);
        expect(AccountOpening.isThirdPartyLink(`mailto:affiliates@${fqdn}`)).to.equal(false);
    });
    test('works for third party domains', () => {
        expect(AccountOpening.isThirdPartyLink('https://www.authorisation.mga.org.mt/verification.aspx?lang=EN&company=a5fd1edc-d072-4c26-b0cd-ab3fa0f0cc40&details=1')).to.equal(true);
        expect(AccountOpening.isThirdPartyLink('https://twitter.com/Binarydotcom')).to.equal(true);
    });
}, 3000);
