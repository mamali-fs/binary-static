import React from 'react';
import { PlatformContext } from '../../../react/context/platform';

export const ArrowsMobile = ({ direction, parent }) => {
    const it = React.useContext(PlatformContext);
    return (
        <div className={`align-self-center ${parent === 'market_tabs' ? 'gr-1' : 'gr-2'} gr-hide gr-show-m gr-show-p gr-no-gutter`}>
            <img
                className={`go-${direction} gr-5 gr-no-gutter gr-centered`}
                data-parent={parent}
                src={it.url_for(`images/pages/home/arrow_${direction}.svg`)}
            />
        </div>
    );
};
