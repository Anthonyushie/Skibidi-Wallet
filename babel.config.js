module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        'inline-dotenv',           // ← this is the plugin name
      ],
    };
  };
  