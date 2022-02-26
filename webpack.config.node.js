const webpackConfig = require('./webpack.config');

webpackConfig.webpack_rules.typescript.use.options.compilerOptions = {
  "outDir": "./dist/node",
};

module.exports = Object.assign(webpackConfig.webpack, {
  devtool: 'source-map',
  module: {
      rules: Object.values(webpackConfig.webpack_rules),
  },
});
