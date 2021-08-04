import React                from 'react';
import moment               from 'moment';
import { 
    AccountsTabContent, 
    MarketsTabContent, 
    TabCircles }            from '../Components';
import { 
    PlatformContext, 
    PlatformDefaultValue }  from '../../../react/context/platform';
import FormVerifyEmail      from '../../../../templates/_common/includes/form_verify_email.jsx';
import { SocialButton }     from '../../../../templates/_common/components/elements.jsx';
import PaymentLogo          from '../../../../templates/_common/components/payment_logo.jsx';
import {
    SeparatorLine,
    SeparatorLineWithText } from '../../../../templates/_common/components/separator_line.jsx';
import {
    TabContainer,
    TabContentContainer,
    TabsSubtabs,
    TabContent }            from  '../../../../templates/_common/components/tabs.jsx';
import DerivBanner          from '../../../../templates/_common/components/deriv_banner.jsx';
import { localize }         from '../../../_common/localize';
import TabSelector          from '../../../_common/tab_selector';
import Login                from '../../../_common/base/login';
import DerivBannerModule    from '../../../app/common/deriv_banner';
import FormManager          from '../../../app/common/form_manager';
import getFormRequest       from '../../../app/common/verify_email';
import GTM                  from '../../../_common/base/gtm';
import { State }            from '../../../_common/storage';
import urlFor               from '../../../_common/url';
import BinaryPjax           from '../../../app/base/binary_pjax';
import BinarySocket         from '../../../app/base/socket';
import { isBinaryApp }      from '../../../config';
import { getElementById }   from '../../../_common/common_functions';
import { createElement }    from '../../../_common/utility';

const checkCountry = (req, clients_country) => {
    const verify_email_form_child = document.querySelector('#frm_verify_email div');
    const fail_msg                = localize('Sorry, account signup is not available in your country.');

    const fail_msg_element        = createElement('p');
    fail_msg_element.setAttribute('class', 'notice-msg center-text');
    fail_msg_element.innerText(fail_msg);

    if ((clients_country !== 'my') || /@((binary|deriv|regentmarkets)\.com|4x\.my|binary\.me)$/.test(req.verify_email)) {
        return true;
    }

    verify_email_form_child.appendChild(fail_msg_element);
    
    return false;
};

const handler = (response) => {
    const signup_error_element  = getElementById('signup_error');
    const social_signup_element = getElementById('social-signup');
    const signup_box_child      = document.querySelector('.signup-box div');
    
    const success_msg           = localize('Thank you for signing up! Please check your email to complete the registration process.');
    const success_msg_element   = createElement('p');
    success_msg_element.setAttribute('class', 'gr-10 gr-centered center-text');
    success_msg_element.innerText(success_msg);

    if (response.error) {
        const error_msg = response.error.message;
        signup_error_element.setVisibility(1);
        signup_error_element.innerText(error_msg);
        return;
    }
    BinarySocket.wait('time').then(({ time }) => {
        const is_binary_app      = isBinaryApp();
        const date_first_contact = localStorage.getItem('date_first_contact');

        GTM.pushDataLayer({
            event                   : 'email_submit',
            email_submit_input      : response.echo_req.verify_email,
            email_submit_days_passed: moment(time * 1000).utc().diff(moment.utc(date_first_contact), 'days'),
            email_submit_source     : is_binary_app ? 'desktop app' : 'binary.com',
        });

        if (is_binary_app) {
            BinaryPjax.load(urlFor('new_account/virtualws'));
        } else {
            signup_box_child.replaceWith(success_msg_element);
            social_signup_element.setVisibility(0);
        }
    });
};

const HomeContent = () => {
    const binary_header = localize('Binary options');
    const binary_desc   = localize('Options that offer a fixed payout based on a simple yes/no proposition.');
    const binary_img    = 'images/pages/home/trade/binary.svg';
    const it = React.useContext(PlatformContext);

    return (
        <React.Fragment>
            <div className='container'>
                <DerivBanner has_margin />
            </div>
            <div id='banner'>
                <div className='container gr-padding-20'>
                    <h1 className='dark center-text gr-padding-20 gr-child'>{localize('Online Trading with [_1]', `<strong>${it.website_name}</strong>`)}</h1>
                    <p className='center-text gr-padding-10'>{localize('Trade 24/7, even on weekends.')}</p>

                    <div className='gr-padding-30 gr-11-m gr-centered gr-child'>
                        <FormVerifyEmail
                            className='secondary-bg-color'
                            dark_button
                            email_padding_mobile={12}
                            button_padding_mobile={12}
                            text={localize('Create free account')}
                        />
                        <div id='social-signup' className='gr-8 gr-10-p gr-12-m gr-no-gutter gr-centered'>
                            <SeparatorLineWithText text={localize('or')} className='gr-padding-20 no-margin full-width' />
                            <p className='center-text no-margin gr-padding-10 gr-parent'>{localize('Create free account with')}</p>
                            <div className='gr-row gr-row-align-center'>
                                <SocialButton provider='google' />
                                <SocialButton provider='facebook' />
                                <SocialButton provider='apple' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='container gr-padding-30'>
                <h2 className='center-text'>{localize('Diverse platforms and account types')}</h2>
                <TabContainer className='gr-padding-30 gr-parent full-width' theme='light'>
                    <TabsSubtabs
                        id='account_tabs'
                        className='gr-padding-20 gr-parent gr-hide-m tab-selector-wrapper'
                        items={[
                            { id: 'binary_options', text: localize('Binary Options') },
                            { id: 'mt5', text: localize('MetaTrader 5') },
                            { id: 'account_tabs_selector', className: 'tab-selector' },
                        ]}
                    />
                    <div className='tab-content'>
                        <TabContentContainer>
                            <TabContent id='binary_options'>
                                <AccountsTabContent
                                    header={localize('Trade binary options on a wide range of web and mobile apps. Each comes with unique strengths that complement a variety of trading strategies.')}
                                    mobile_header={localize('Binary Options')}
                                    image='images/pages/home/binary_options.svg'
                                    image_one='images/pages/home/icons/demo.svg'
                                    list_header_one={localize('Demo Account')}
                                    list_text_one={localize('Practice account with replenishable 10,000 USD demo credit.')}
                                    image_two='images/pages/home/icons/real.svg'
                                    list_header_two={localize('Real Account')}
                                    list_text_two={localize('Real-money accounts with your choice of fiat and crypto currency.')}
                                />
                            </TabContent>
                            <TabContent id='mt5'>
                                <AccountsTabContent
                                    header={localize('Trade forex and CFDs on our popular multi-asset platform.')}
                                    mobile_class='padding-top-20'
                                    mobile_header={localize('MetaTrader 5')}
                                    image='images/pages/home/MT5.svg'
                                    image_one='images/pages/home/icons/demo.svg'
                                    list_header_one={localize('MT5 Demo')}
                                    list_text_one={localize('Practice account with replenishable 10,000 USD demo credit.')}
                                    image_two='images/pages/home/icons/mt5_financial.svg'
                                    list_header_two={localize('MT5 Financial')}
                                    list_text_two={localize('MT5 real-money account for forex and CFDs.')}
                                    image_three='images/pages/home/icons/mt5_synthetic.svg'
                                    list_header_three={localize('MT5 Synthetic')}
                                    list_text_three={localize('MT5 real-money account for Synthetic Indices only.')}
                                />
                            </TabContent>
                        </TabContentContainer>
                    </div>
                    <TabCircles number={2} id='account_tabs_circles' />
                </TabContainer>

                <div className='center-text gr-padding-20 gr-parent'>
                    <h3 className='center-text gr-padding-20 gr-parent'>{localize('Choose the platforms and accounts you need, based on your personal trading style')}</h3>
                    <a className='button-secondary' href={it.url_for('platforms')}>
                        <span>{localize('View our platforms')}</span>
                    </a>
                </div>

                <SeparatorLine className='gr-padding-30' show_mobile />
            </div>

            <div id='market_tabs_container' className='container'>
                <h2 className='center-text gr-padding-10'>{localize('Trade in the world\'s financial markets')}</h2>
                <TabContainer className='gr-padding-30 gr-parent full-width' theme='light'>
                    <TabsSubtabs
                        id='market_tabs'
                        className='gr-padding-20 gr-parent gr-hide-m gr-hide-p tab-selector-wrapper'
                        items={[
                            { id: 'binary',    text: binary_header },
                            { id: 'forex',     text: localize('Forex') },
                            { id: 'crypto',    text: localize('Crypto') },
                            { id: 'cfds',      text: localize('CFDs') },
                            { id: 'metals',    text: localize('Metals') },
                            { id: 'lookbacks', text: localize('Lookbacks') },
                            { id: 'market_tabs_selector', className: 'tab-selector' },
                        ]}
                    />
                    <div className='tab-content'>
                        <TabContentContainer>
                            <TabContent id='binary'>
                                <MarketsTabContent
                                    header={binary_header}
                                    text={binary_desc}
                                    image={binary_img}
                                />
                            </TabContent>
                            <TabContent id='forex'>
                                <MarketsTabContent
                                    header={localize('Forex')}
                                    text={localize('Major, minor and exotic currency pairs.')}
                                    image='images/pages/home/trade/forex.svg'
                                />
                            </TabContent>
                            <TabContent id='crypto'>
                                <MarketsTabContent
                                    header={localize('Cryptocurrencies*')}
                                    text={localize('Cryptocurrency pairs including Bitcoin, Ethereum, and Litecoin.')}
                                    image='images/pages/home/trade/crypto.svg'
                                    footnote={localize('*Cryptocurrency pairs are not available for DMT5 Financial accounts registered with Deriv (V) Ltd.')}
                                />
                            </TabContent>
                            <TabContent id='cfds'>
                                <MarketsTabContent
                                    header={localize('CFDs')}
                                    text={localize('Financial derivatives that allow you to trade on the movement of underlying assets.')}
                                    image='images/pages/home/trade/cfds.svg'
                                />
                            </TabContent>
                            <TabContent id='metals'>
                                <MarketsTabContent
                                    header={localize('Metals')}
                                    text={localize('Precious metal pairs including gold and platinum.')}
                                    image='images/pages/home/trade/metals.svg'
                                />
                            </TabContent>
                            <TabContent id='lookbacks'>
                                <MarketsTabContent
                                    header={localize('Lookbacks')}
                                    text={localize('Options that let you “look back” on the optimum high or low achieved by the market to determine the payout.')}
                                    image='images/pages/home/trade/lookbacks.svg'
                                />
                            </TabContent>
                        </TabContentContainer>
                    </div>
                    <TabCircles number={6} id='market_tabs_circles' />
                </TabContainer>
                <h3 className='center-text gr-padding-30'>{localize('Choose from 100+ tradable instruments, backed by award-winning technology and innovation since 2000.')}</h3>
            </div>

            <div className='gr-padding-10 fill-bg-color'>
                <div className='gr-padding-20'>
                    <div className='gr-row container'>
                        <div className='gr-12 align-self-center center-text gr-padding-10'>
                            <h3 className='no-margin'>{localize('Award-winning trading excellence')}</h3>
                        </div>
                        <div className='award-icons'>
                            {/* TODO: add this later when we have sufficient awards for two lines */}
                            {/* <div className='award-icon'>
                                <img className='responsive' src={it.url_for('images/pages/home/awards/t2w-2010.svg')} alt='Trade2Win Award' />
                                <span className='caption'>{localize('Trade2Win')}</span>
                            </div> */}
                            <div className='award-icon'>
                                <img className='responsive' src={it.url_for('images/pages/home/awards/gbfr-2012.svg')} alt='Global Banking and Finance Review 2012' />
                                <span className='caption'>{localize('Global Banking and Finance Review')}</span>
                            </div>
                            <div className='award-icon'>
                                <img className='responsive' src={it.url_for('images/pages/home/awards/egr-2015.svg')} alt='EGR Operator Awards 2015' />
                                <span className='caption'>{localize('EGR Operator Awards')}</span>
                            </div>
                            <div className='award-icon'>
                                <img className='responsive' src={it.url_for('images/pages/home/awards/mena-2016.svg')} alt='16th MENA Financial Forum & Expo 2016' />
                                <span className='caption'>{localize('16th MENA Financial Forum & Expo')}</span>
                            </div>
                            <div className='award-icon'>
                                <img className='responsive' src={it.url_for('images/pages/home/awards/opm-2017.svg')} alt='Online Personal Wealth Awards 2017' />
                                <span className='caption'>{localize('Online Personal Wealth Awards')}</span>
                            </div>
                            <div className='award-icon'>
                                <img className='responsive' src={it.url_for('images/pages/home/awards/gbf-2018.svg')} alt='Global Banking & Finance Awards 2018' />
                                <span className='caption'>{localize('Global Banking & Finance Awards')}</span>
                            </div>
                            <div className='award-icon'>
                                <img className='responsive' src={it.url_for('images/pages/home/awards/gbm-2018.svg')} alt='Global Brands Magazine 2018' />
                                <span className='caption'>{localize('Global Brands Magazine')}</span>
                            </div>
                            <div className='award-icon'>
                                <img className='responsive' src={it.url_for('images/pages/home/awards/gbm-2019.svg')} alt='Global Brands Magazine 2019' />
                                <span className='caption'>{localize('Global Brands Magazine')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='container gr-padding-30 gr-child'>
                <div id='payment_methods'>
                    <div className='gr-12 gr-padding-20'>
                        <h2 className='center-text'>{localize('Payment methods')}</h2>
                        <p className='center-text'>{localize('We support hundreds of deposit and withdrawal options, including Bitcoin.')}</p>

                        <div className='gr-12 gr-padding-30'>
                            <div className='gr-row gr-row-align-center'>
                                <PaymentLogo />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

const Home = () => {
    React.useEffect(() => {
        Login.initOneAll();
        DerivBannerModule.onLoad();
        TabSelector.onLoad();

        return () => {
            DerivBannerModule.onUnload();
            TabSelector.onUnload();
        };
    }, []);

    React.useEffect(() => {
        BinarySocket.wait('website_status', 'authorize', 'landing_company').then(() => {
            const clients_country = State.getResponse('website_status.clients_country');

            // we need to initiate selector after it becoming visible
            TabSelector.repositionSelector();

            const form_id = '#frm_verify_email';
            FormManager.init(form_id, getFormRequest());
            FormManager.handleSubmit({
                form_selector       : form_id,
                fnc_response_handler: handler,
                fnc_additional_check: (req) => checkCountry(req, clients_country),
            });
        });
    }, []);
    return (
        <PlatformContext.Provider value={PlatformDefaultValue}>
            <HomeContent />
        </PlatformContext.Provider>
    );
};

export default Home;
