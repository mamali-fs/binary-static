import {expect} from 'chai';
import statement from '../statement/statement';
import {setUpWebsocket, getApiToken, tearDownWebsocket} from '../../../../../_common/__tests__/tests_common'


describe('Statement', () => {
    let statement_ws;
    beforeAll(async function () {
        const {authorize, getStatement} = await setUpWebsocket();
        await authorize(getApiToken());
        const {statement} = await getStatement({limit: 1, description: 1, offset: 0});
        statement_ws      = statement;
    }, 10_000);
    afterAll(tearDownWebsocket);
    it('Should have all expected data', () => {
        if (statement_ws.transactions.length) {
            const statement_data = statement.getStatementData(statement_ws.transactions[0]);
            expect(statement_data).to.be.an('Object')
                .and.to.have.property('date')
                .and.to.be.a('string');
            expect(statement_data).to.have.property('ref')
                .and.to.be.a('number');
            expect(statement_data).to.have.property('payout')
                .and.to.be.a('string');
            expect(statement_data).to.have.property('localized_action')
                .and.to.be.a('string');
            expect(statement_data).to.have.property('action_type')
                .and.to.be.a('string');
            expect(statement_data).to.have.property('amount')
                .and.to.be.a('string');
            expect(statement_data).to.have.property('balance')
                .and.to.be.a('string');
            expect(statement_data).to.have.property('desc')
                .and.to.be.a('string');
            if (/buy|sell/.test(statement_data.action_type)) {
                expect(statement_data).to.have.property('id')
                    .and.to.be.a('number');
            }
        }
    });
});
