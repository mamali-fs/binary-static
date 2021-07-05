import React from 'react';
import { AccountsListItem } from './account-list-item.jsx';
import { ArrowsDesktop } from './arrows-desktop.jsx';
import { ArrowsMobile } from './arrows-mobile.jsx';
import { PlatformContext } from '../../../react/context/platform';

export const AccountsTabContent = ({
    header,
    image,
    mobile_header,
    mobile_class,
    image_one,
    image_two,
    image_three,
    list_header_one,
    list_header_two,
    list_header_three,
    list_text_one,
    list_text_two,
    list_text_three,
}) => {
    const it = React.useContext(PlatformContext);
    return (
        <React.Fragment>
            <div className='gr-hide-m'>
                <p className='center-text gr-10 gr-no-gutter gr-centered'>{header}</p>
            </div>
            <div className='gr-row gr-padding-30'>
                <ArrowsDesktop parent='account_tabs' direction='left' />
                <div className='gr-10 gr-12-m'>
                    <div className='gr-row'>
                        <div className='gr-6 gr-10-m gr-centered align-self-center'>
                            <img className='responsive' src={it.url_for(image)} />
                        </div>
                        <div className={`center-text gr-12 gr-hide gr-show-m ${mobile_class || ''}`}>
                            <div className='gr-10 gr-centered margin-top-10'>
                                <div className='gr-row'>
                                    <ArrowsMobile parent='account_tabs' direction='left' />
                                    <strong className='align-self-center gr-centered'>{mobile_header}</strong>
                                    <ArrowsMobile parent='account_tabs' direction='right' />
                                </div>
                            </div>
                            <div className='gr-12'><p>{header}</p></div>
                        </div>
                        <div className='gr-6 gr-12-m'>
                            <AccountsListItem
                                image={image_one}
                                list_header={list_header_one}
                                list_text={list_text_one}
                            />
                            <AccountsListItem
                                image={image_two}
                                list_header={list_header_two}
                                list_text={list_text_two}
                            />
                            { list_header_three &&
                            <AccountsListItem
                                image={image_three}
                                list_header={list_header_three}
                                list_text={list_text_three}
                            />
                            }
                        </div>
                    </div>
                </div>
                <ArrowsDesktop parent='account_tabs' direction='right' />
            </div>
        </React.Fragment>
    );

};
