// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    /* ... */
  },
  exclude: ["**/node_modules/**/*", "infrastructure/**"],
  plugins: [
    /* ... */
  ],
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
    port: 8081,
  },
  buildOptions: {
    /* ... */
  },
};
