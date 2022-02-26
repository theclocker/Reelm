const webpackConfig = require('./webpack.config');
const path = require('path');

webpackConfig.webpack_rules.typescript.use.options.compilerOptions = {
  "outDir": "./dist/web",
  "sourceMap": false
};

module.exports = Object.assign(webpackConfig.webpack, {
  module: {
      rules: Object.values(webpackConfig.webpack_rules),
  },
  output: {
    filename: "index.js",
    libraryTarget: 'var',
    library: 'Reelm',
    path: path.resolve(__dirname, 'dist/web'),
  }
});