import React from 'react';
import { ArrowsMobile } from './arrows-mobile.jsx';
import { PlatformContext } from '../../../react/context/platform';

export const MarketsContent = ({ text, header, image, footnote }) => {
    const it = React.useContext(PlatformContext);
    return (
        <div className='gr-10 gr-12-m gr-centered'>
            <div className='gr-row'>
                <div className='gr-6 gr-12-m gr-12-p center-text-m order-2-m'>
                    <div className='gr-12-m gr-10-p gr-centered gr-gutter'>
                        <div className='gr-row'>
                            <ArrowsMobile parent='market_tabs' direction='left' />
                            <strong className='align-self-center gr-centered-m'>{header}</strong>
                            <ArrowsMobile parent='market_tabs' direction='right' />
                        </div>
                    </div>
                    <p>{text}</p>
                    {footnote && <p className='hint'>{footnote}</p>}
                </div>
                <div className='gr-6 gr-12-m gr-12-p center-text'>
                    <img className='responsive' src={it.url_for(image)} />
                </div>
            </div>
        </div>
    );
};
