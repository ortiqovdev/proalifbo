const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const config = getDefaultConfig(__dirname);
config.watchFolders = [...config.watchFolders, path.resolve(__dirname, '../shared')];
const enhance = config.server.enhanceMiddleware;
config.server.enhanceMiddleware = (middleware, server) =>
  require('./ocr-middleware')(enhance ? enhance(middleware, server) : middleware);
module.exports = config;

