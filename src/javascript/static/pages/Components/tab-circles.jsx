import React from 'react';

export const TabCircles = ({ id, number }) => (
    <div className='gr-hide gr-show-m gr-show-p center-text'>
        <div className='tab-circles' id={id || undefined}>
            { Array.from(new Array(number)).map((x, inx) => (
                <div key={inx} className='tab-circle' />
            ))}
        </div>
    </div>
);
