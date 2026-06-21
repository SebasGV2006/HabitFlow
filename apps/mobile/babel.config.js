module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@/components': './src/components',
            '@/screens': './src/screens',
            '@/navigation': './src/navigation',
            '@/store': './src/store',
            '@/hooks': './src/hooks',
            '@/services': './src/services',
            '@/constants': './src/constants',
            '@/types': './src/types',
            '@/utils': './src/utils'
          }
        }
      ]
    ]
  };
};
