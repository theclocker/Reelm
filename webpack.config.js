const path = require('path');
const { kill } = require('process');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpack_rules = {
    typescript: {
        test: /\.ts?$/,
        use: {
            loader: 'ts-loader',
            options: {}
        },
    }
}

module.exports = (...args) => {
    const cliArgs = args[0][1];
    const isWatching = cliArgs.env.WEBPACK_SERVE;
    const rules = {
        webpack_rules,
        webpack: ({
            entry: './src/index.ts',
            module: {
                rules: Object.values(webpack_rules),
            },
            resolve: {
                extensions: ['.ts', '.js'],
            },
            output: {
                filename: '[name].js',
                path: path.resolve(__dirname, 'dist/node'),
            },
        })
    };
    if (isWatching) {
        rules.webpack.devServer = {
            liveReload: true,
            watchFiles: {
                paths: [path.resolve('./src')]
            },
            static: {
                directory: path.resolve(__dirname, './src/examples'),
            },
            client: {
                overlay: true,
                progress: true,
            },
            port: 9000
        };
        rules.webpack.plugins = [
            new HtmlWebpackPlugin({
                inject: 'head',
                scriptLoading: 'blocking',
                template: './src/examples/index.html'
            })
        ]
    }
    return rules;
};