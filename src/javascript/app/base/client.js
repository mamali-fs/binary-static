const BinarySocket       = require('./socket');
const RealityCheckData   = require('../pages/user/reality_check/reality_check.data');
const ClientBase         = require('../../_common/base/client_base');
const GTM                = require('../../_common/base/gtm');
const SocketCache        = require('../../_common/base/socket_cache');
const getElementById     = require('../../_common/common_functions').getElementById;
const removeCookies      = require('../../_common/storage').removeCookies;
const urlFor             = require('../../_common/url').urlFor;
const applyToAllElements = require('../../_common/utility').applyToAllElements;
const getPropertyValue   = require('../../_common/utility').getPropertyValue;

const Client = (() => {
    const processNewAccount = (options) => {
        if (ClientBase.setNewAccount(options)) {
            window.location.href = options.redirect_url || defaultRedirectUrl(); // need to redirect not using pjax
        }
    };

    const activateByClientType = (section_id) => {
        const topbar_class = getElementById('topbar').classList;
        const el_section   = section_id ? getElementById(section_id) : document.body;

        const primary_bg_color_dark = 'primary-bg-color-dark';
        const secondary_bg_color    = 'secondary-bg-color';

        if (ClientBase.isLoggedIn()) {
            BinarySocket.wait('authorize', 'website_status', 'get_account_status').then(() => {
                const client_logged_in = getElementById('client-logged-in');
                client_logged_in.classList.add('gr-centered');

                applyToAllElements('.client_logged_in', (el) => {
                    el.setVisibility(1);
                });

                if (ClientBase.get('is_virtual')) {
                    applyToAllElements('.client_virtual', (el) => { el.setVisibility(1); }, '', el_section);
                    topbar_class.add(secondary_bg_color);
                    topbar_class.remove(primary_bg_color_dark);
                } else {
                    applyToAllElements('.client_real', (el) => {
                        el.setVisibility(1);
                    }, '', el_section);
                    topbar_class.add(primary_bg_color_dark);
                    topbar_class.remove(secondary_bg_color);
                }
            });
        } else {
            applyToAllElements('.client_logged_in', (el) => {
                el.setVisibility(0);
            }, '', el_section);
            applyToAllElements('#client-logged-in', (el) => {
                el.setVisibility(0);
            }, '', el_section);
            getElementById('topbar-msg').setVisibility(0);
            getElementById('menu-top').classList.remove('smaller-font', 'top-nav-menu');

            applyToAllElements('.client_logged_out', (el) => {
                el.setVisibility(1);
            }, '', el_section);
            topbar_class.add(primary_bg_color_dark);
            topbar_class.remove(secondary_bg_color);
        }
    };

    const sendLogoutRequest = (show_login_page) => {
        if (show_login_page) {
            sessionStorage.setItem('showLoginPage', 1);
        }
        BinarySocket.send({ logout: '1' }).then((response) => {
            if (response.logout === 1) {
                GTM.pushDataLayer({ event: 'log_out' });
            }
        });
    };

    const doLogout = (response) => {
        if (response.logout !== 1) return;
        removeCookies('login', 'loginid', 'loginid_list', 'email', 'residence', 'settings'); // backward compatibility
        removeCookies('reality_check', 'affiliate_token', 'affiliate_tracking', 'onfido_token');
        // clear elev.io session storage
        sessionStorage.removeItem('_elevaddon-6app');
        sessionStorage.removeItem('_elevaddon-6create');
        ClientBase.clearAllAccounts();
        ClientBase.set('loginid', '');
        SocketCache.clear();
        RealityCheckData.clear();
        const redirect_to = getPropertyValue(response, ['echo_req', 'passthrough', 'redirect_to']);
        if (redirect_to) {
            window.location.href = redirect_to;
        } else {
            window.location.reload();
        }
    };

    const getUpgradeInfo = () => {
        const upgrade_info = ClientBase.getBasicUpgradeInfo();
        const links = {};
        const upgrade_links = {};

        if (upgrade_info.can_upgrade_to) {
            const upgrade_link_map = {
                realws       : ['svg', 'iom', 'malta'],
                maltainvestws: ['maltainvest'],
            };

            Object.entries(upgrade_link_map).forEach(([link, haystack]) => {
                upgrade_info.can_upgrade_to.forEach(landing_company => {
                    if (haystack.some(value => value === landing_company)) {
                        Object.assign(links, { [landing_company]: link });
                    }
                });
            });
        }

        Object.entries(links).forEach(([landing_company, link]) => Object.assign(upgrade_links, {
            [landing_company]: `new_account/${link}`,
        }));

        const getUpgradeLink = (landing_company) => {
            if (!landing_company) {
                const types             = Object.keys(upgrade_links);
                const landing_companies = Object.values(upgrade_links);
                console.log('types', types);
                if (types.length === 1) {
                    return landing_companies[0];
                } else {
                    return 'user/accounts';
                }
            } else {
                return upgrade_links[landing_companies];
            }
        };


        return Object.assign(upgrade_info, {
            upgrade_links,
            isCurrentPathAllowed: () => Object.values(links).some(link => (new RegExp(link, 'i').test(window.location.pathname))),
            getUpgradeLink,
        });
    };

    const defaultRedirectUrl = () => urlFor('trading');

    return Object.assign({
        processNewAccount,
        activateByClientType,
        sendLogoutRequest,
        doLogout,
        getUpgradeInfo,
        defaultRedirectUrl,
    }, ClientBase);
})();

module.exports = Client;
