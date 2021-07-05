import React from 'react';

export const PlatformContext = React.createContext();

export const PlatformDefaultValue = {
    website_name: 'Binary.com',
    L           : (text, ...args) => {
        // eslint-disable-next-line no-console
        console.info(`Translation: ${  text}`);
        return text;
    },
    url_for: (v) => v,
};
