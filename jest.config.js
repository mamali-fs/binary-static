module.exports = {
    'modulePathIgnorePatterns': [
        '<rootDir>/src/javascript/_common/__tests__/tests_common.js',
    ],
    'setupFiles': [
        '<rootDir>/test-env.js',
    ],
    'transform': {
        '^.+\\.js': '<rootDir>/node_modules/babel-jest',
    },
    'transformIgnorePatterns': [
        '<rootDir>/node_modules/(?!emphasize)',
    ],
    'setupFilesAfterEnv': [
        '<rootDir>/test-after-env.js',
    ],
    'testEnvironment': 'jsdom',
    'bail'           : true,
};
