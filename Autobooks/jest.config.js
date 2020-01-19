module.exports = {
    'setupFilesAfterEnv': [
        './setupTests.js'
    ],
    'bail': true,
    verbose: true,
    'transform': {
        '^.+\\.js?$': 'babel-jest'
    },
    'testMatch': ['**/src/**/*.test.js'],
    'moduleFileExtensions': ['js'],
    'collectCoverage': true,
    'coverageReporters': ['json', 'html'],
    'moduleNameMapper': {
        '^@app(.*)$': '<rootDir>/src$1',
        '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2|svg)$': 'jest-transform-stub'
    }
};
