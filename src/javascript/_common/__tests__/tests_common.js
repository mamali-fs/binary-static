// const { LiveApi }          = require('binary-live-api');
const expect               = require('chai').expect;
// const websocket            = require('ws');
// const Client               = require('../../app/base/client');
const Language             = require('../language');
const Url                  = require('../url');
// ignore svgs in tests. @TODO once svg inliner or jsdom upgrades, check again to see if we can remove this
require.extensions['.svg'] = () => '<svg></svg>';

function setURL (url) {
    const location = new URL(url)
    location.assign = jest.fn()
    location.replace = jest.fn()
    location.reload = jest.fn()

    delete window.location
    window.location = location

    Url.reset();
    Language.reset();
}

module.exports = {
    expect,
    setURL,
    getApiToken: () => 'hhh9bfrbq0G3dRf',
    // api        : new LiveApi({ websocket, appId: 1 }),
};
