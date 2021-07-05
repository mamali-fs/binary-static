import React from 'react';
import { MarketsContent } from './markets-content.jsx';
import { ArrowsDesktop } from './arrows-desktop.jsx';

export const MarketsTabContent = ({ text, header, image, footnote }) => (
    <div className='gr-row gr-row-align-middle'>
        <ArrowsDesktop parent='market_tabs' direction='left' />
        <MarketsContent text={text} header={header} image={image} footnote={footnote} />
        <ArrowsDesktop parent='market_tabs' direction='right' />
    </div>
);
