import {expect} from 'chai';
import trading_times from '../trading_times/trading_times';
import {setUpWebsocket, tearDownWebsocket} from "../../../../_common/__tests__/tests_common";

let trading_times_res, active_symbols_res;

describe('Trading Times', () => {
    beforeAll(async function () {
        const {getTradingTimes, getActiveSymbolsBrief, } = await setUpWebsocket();

        const {trading_times} = await getTradingTimes(new Date());
        trading_times_res     = trading_times;

        const {active_symbols} = await getActiveSymbolsBrief();
        active_symbols_res     = active_symbols;
    }, 10000);
    afterAll(tearDownWebsocket);

    it('Should have all functions that are being tested', () => {
        expect(trading_times).to.have.all.of.keys(['getSubmarketInfo', 'getSymbolInfo']);
    });

    it('Should trading_times and getSubmarketInfo() have all expected data', () => {
        expect(trading_times_res).to.be.an('object')
            .that.have.property('markets');
        expect(trading_times_res.markets).to.be.an('array');
        trading_times_res.markets.forEach((market) => {
            expect(market).to.be.an('object')
                .that.have.property('name')
                .that.is.a('string');
            expect(market).to.have.property('submarkets')
                .that.is.an('array');

            market.submarkets.forEach((submarket) => {
                expect(submarket).to.be.an('object')
                    .that.have.property('name')
                    .that.is.a('string');
                expect(submarket).to.have.property('symbols')
                    .that.is.an('array');

                const submarket_info = trading_times.getSubmarketInfo(active_symbols_res, submarket.name);
                expect(submarket_info).to.be.an('array');
                submarket_info.forEach((info) => {
                    expect(info).to.be.an('object')
                        .that.have.property('market')
                        .that.is.a('string');
                    expect(info).to.have.property('submarket')
                        .that.is.an('string');
                });

                submarket.symbols.forEach((symbol) => {
                    expect(symbol).to.be.an('object')
                        .that.have.property('name')
                        .that.is.a('string');
                    expect(symbol).to.have.property('symbol')
                        .that.is.an('string');
                });
            });
        });
    });
});
