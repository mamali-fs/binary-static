import React from 'react';
import { PlatformContext } from '../../../react/context/platform';

export const AccountsListItem = ({ image, list_header, list_text }) => {
    const it = React.useContext(PlatformContext);
    return (
        <div className='gr-row gr-padding-10'>
            <div className='gr-2 gr-no-gutter gr-gutter-left-m'>
                <img className='responsive' src={it.url_for(image)} />
            </div>
            <div className='gr-10 gr-no-gutter-right'>
                <strong>{list_header}</strong>
                <p className='hint'>{list_text}</p>
            </div>
        </div>
    );
};
