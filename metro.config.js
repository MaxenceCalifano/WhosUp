// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('jsx', 'js', 'ts', 'tsx', 'cjs')
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
    },
  })


/* module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
        },
      }),
    },
    resolver: {
      sourceExts: ['jsx', 'js', 'ts', 'tsx', 'cjs'],
    },
  }; */
  module.exports = config;