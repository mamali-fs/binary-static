import Language from '../language';
import { LiveApi } from 'binary-live-api';
import websocket from 'ws';

// ignore svgs in tests. @TODO once svg inliner or jsdom upgrades, check again to see if we can remove this
require.extensions['.svg'] = () => '<svg></svg>';

let api;

/**
 * @returns {Promise}
 */
function setUpWebsocket() {
    return new Promise(resolve => {
        if (!api) {
            api = new LiveApi({websocket, appId: 1});
            api.socket.onopen = function () {
                resolve(api);
            }
        } else {
            resolve(api);
        }
    })

}

function tearDownWebsocket() {
    return new Promise(resolve => {
        api?.disconnect();
        if (!api?.isReady()) {
            api = undefined;
            resolve();
        }
    })
}

/**
 * @param {string} url
 */
function setURL (url) {
    const { location } = window;
    delete window.location
    const new_location = new URL(url)
    new_location.assign = jest.fn()
    new_location.replace = jest.fn()
    new_location.reload = jest.fn()

    window.location = new_location
    global.window.location = new_location;

    Language.reset();

    return location;
}

/**
 * {readonly scope}
 *
 * Exposing this token doesn't make any harm, since this is defined as READ-ONLY.
 * @returns {string}
 */
function getApiToken() {
    return 'hhh9bfrbq0G3dRf';
}


export {
    setURL,
    getApiToken,
    setUpWebsocket,
    tearDownWebsocket
};
