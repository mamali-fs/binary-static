import profitTable from '../profit_table/profit_table';
import {tearDownWebsocket, setUpWebsocket, getApiToken} from "../../../../../_common/__tests__/tests_common";

describe('Profit Table', () => {
    let profit_table;
    beforeAll(async function () {
        const { authorize, getProfitTable } = await setUpWebsocket();
        await authorize(getApiToken());
        const response = await getProfitTable({ limit: 1, description: 1, offset: 0 });
        profit_table = response.profit_table;
    }, 10_000);
    afterAll(tearDownWebsocket);
    it('Should have all expected data', () => {
        if (profit_table.transactions.length) {
            const profit_table_data = profitTable.getProfitTabletData(profit_table.transactions[0]);
            expect(profit_table_data).to.be.an('Object')
                .and.to.have.property('buyDate')
                .and.to.be.a('string');
            expect(profit_table_data).to.have.property('ref')
                .and.to.be.a('number');
            expect(profit_table_data).to.have.property('payout')
                .and.to.be.a('string');
            expect(profit_table_data).to.have.property('buyPrice')
                .and.to.be.a('string');
            expect(profit_table_data).to.have.property('sellDate')
                .and.to.be.a('string');
            expect(profit_table_data).to.have.property('sellPrice')
                .and.to.be.a('string');
            expect(profit_table_data).to.have.property('pl')
                .and.to.be.a('string');
            expect(profit_table_data).to.have.property('desc')
                .and.to.be.a('string');
            expect(profit_table_data).to.have.property('id')
                .and.to.be.a('number');
        }
    });
});
