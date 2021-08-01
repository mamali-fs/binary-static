import { expect } from 'chai';
import AccountOpening from '../account_opening';
import { setURL } from '../../../_common/__tests__/tests_common';
import { State } from '../../../_common/storage';
import { websiteUrl} from "../../../_common/url";

global.$                 = require('jquery');


describe('AccountOpening', () => {
    describe('.redirectAccount()', () => {
        it('will redirect client who can upgrade to maltainvest to the corresponding account opening page', () => {
            State.set(['response', 'authorize', 'authorize', 'upgradeable_landing_companies'], ['maltainvest']);
            expect(AccountOpening.redirectAccount()).to.eq(1);
        });
        it('will not redirect client who is already on maltainvest account opening page again', () => {
            setURL(`${websiteUrl()}en/maltainvestws.html`);
            expect(AccountOpening.redirectAccount()).to.eq(0);
        });
        it('will redirect client who cannot upgrade their account to the previous page', () => {
            State.set(['response', 'authorize', 'authorize', 'upgradeable_landing_companies'], []);
            expect(AccountOpening.redirectAccount()).to.eq(-1);
        });
    });
});
