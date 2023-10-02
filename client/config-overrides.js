const BundleTracker = require('webpack-bundle-tracker');
const paths = require('react-scripts/config/paths');
const WriteFilePlugin = require('write-file-webpack-plugin');
const {
  override,
  addWebpackPlugin,
} = require('customize-cra');

function appOverride(config) {
  // console.log({config, paths})
  // todo prod + local
  config.output.publicPath = `/static/build/`;
  return config;
}

module.exports = override(
  appOverride,
  addWebpackPlugin(
    new BundleTracker({ filename: './build/webpack-stats.json' })
  ),
  addWebpackPlugin(new WriteFilePlugin())
);
