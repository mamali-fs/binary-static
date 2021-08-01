import asset_index from '../asset_index/asset_index';
import {setUpWebsocket, tearDownWebsocket} from '../../../../_common/__tests__/tests_common';
import { expect } from 'chai';

describe('Asset Index', () => {
    let asset_index_res,
        active_symbols_res;

    beforeAll(async function () {
        const { getAssetIndex, getActiveSymbolsBrief} = await setUpWebsocket();
        const { asset_index } = await getAssetIndex();
        asset_index_res = asset_index;
        const response = await getActiveSymbolsBrief();
        active_symbols_res = response.active_symbols;
    }, 10000);
    afterAll(async () => {
        await tearDownWebsocket();
    });

    it('Should have all functions that are being tested', () => {
        expect(asset_index).to.have.all.of.keys(['getAssetIndexData', 'getMarketColumns']);
    });

    it('Should getAssetIndexData() have all expected data', () => {
        const asset_index_data = asset_index.getAssetIndexData(asset_index_res, active_symbols_res);
        expect(asset_index_data).to.be.an('array');
        asset_index_data.forEach((asset_index_item) => {
            expect(asset_index_item).to.be.an('array')
                .to.have.lengthOf(5);
            expect(asset_index_item[0]).to.be.a('string');
            expect(asset_index_item[1]).to.be.a('string');
            expect(asset_index_item[2]).to.be.an('array');
            expect(asset_index_item[3]).to.be.an('object')
                .and.to.have.property('market')
                .that.is.a('string');
            expect(asset_index_item[3])
                .and.to.have.property('submarket')
                .that.is.a('string');
            expect(asset_index_item[3]).to.have.property('submarket')
                .that.is.a('string');
            expect(asset_index_item[4]).to.be.an('object');
        });
    });

    it('Should getMarketColumns() have all expected data', () => {
        const market_columns = asset_index.getMarketColumns();
        expect(market_columns).to.be.an('Object');
        Object.keys(market_columns).forEach((market) => {
            expect(market_columns[market]).to.have.property('columns')
                .that.is.an('array');
            expect(market_columns[market].columns.length).to.equal(market_columns[market].header.length);
        });
    });
});
