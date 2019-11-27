const webpack = require('webpack');
const path = require('path');

let config = {
    entry: './dist/script.js',
    output: {
        path: path.resolve(__dirname, '.'),
        filename: 'script.js'
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    }
};

module.exports = config;
