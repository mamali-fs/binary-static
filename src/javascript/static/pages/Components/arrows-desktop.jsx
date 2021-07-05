import React from 'react';
import { PlatformContext } from '../../../react/context/platform';

export const ArrowsDesktop = ({ direction, parent }) => {
    const it = React.useContext(PlatformContext);
    return (
        <div className='align-self-center gr-1 gr-hide-p'>
            <img
                className={`go-${direction} gr-10 gr-12-p gr-no-gutter-p gr-centered`}
                data-parent={parent}
                src={it.url_for(`images/pages/home/arrow_${direction}.svg`)}
                alt={direction}
            />
        </div>
    );
};
