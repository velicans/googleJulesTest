const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',

  // Default base URL for all projects, can be overridden per project
  use: {
    baseURL: 'https://petstore.swagger.io',
  },

  projects: [
    {
      name: 'dev',
      use: {
        baseURL: 'https://dev-petstore.swagger.io',
      },
    },
    {
      name: 'test',
      use: {
        baseURL: 'https://test-petstore.swagger.io',
      },
    },
    {
      name: 'preprod',
      use: {
        baseURL: 'https://preprod-petstore.swagger.io',
      },
    },
  ],
});