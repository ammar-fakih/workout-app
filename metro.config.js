const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.server = {
  ...config.server,
  rewriteRequestUrl: (url) => {
    if (!url.endsWith(".bundle")) {
      return url;
    }
    return (
      url +
      "?platform=ios&dev=true&minify=false&modulesOnly=false&runModule=true"
    );
  },
};

module.exports = config;
