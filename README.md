# Fastify Bugsnag Plugin

[![NPM version](https://img.shields.io/npm/v/fastify-bugsnag.svg?style=flat)](https://www.npmjs.com/package/fastify-bugsnag)
![CI workflow](https://github.com/ZigaStrgar/fastify-bugsnag/workflows/fastify-bugsnag-ci/badge.svg)
[![Known Vulnerabilities](https://snyk.io/test/github/ZigaStrgar/fastify-bugsnag/badge.svg)](https://snyk.io/test/github/ZigaStrgar/fastify-bugsnag)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://standardjs.com/)

Easily send your application errors to [Bugsnag](https://bugsnag.com) from your [Fastify](https://www.fastify.io/)
server.

## Installation

```shell
npm install fastify-bugsnag --save

# OR

yarn add fastify-bugsnag
```

## Usage

```javascript
const fastify = require('fastify')();

fastify.register(require('fastify-bugsnag'), {
  apiKey: 'Your-Bugsnag-API-Key', // Defaults to process.env.BUGSNAG_API_KEY
  enableReporting: process.env.NODE_ENV === 'production', // OR similar
});

fastify.get('/', async (request, reply) => {
  fastify.bugsnag.leaveBreadcrumb('Visited homepage'); // OR request.bugsnag.leaveBreadcrumb();
});

fastify.get('/error', async (request, reply) => {
  request.bugsnag.notify(new Error('This is a generic error'));
});
```

## Description

The plugin will decorate fastify instance with `bugsnag` property and `request` as well. The value behind `bugsnag`, is
a full BugsnagClient. [Bugsnag documentation](https://docs.bugsnag.com/platforms/javascript/)

Be aware that the plugin mimics the behaviour of
official [Bugsnag Express](https://github.com/bugsnag/bugsnag-js/tree/next/packages/plugin-express) plugin with appending
the request data to the error. That includes `body`, `query` and `params` which may include user data!

## Options

| Parameter         | Default Value                 | Description                                                                                 |
|-------------------|-------------------------------|---------------------------------------------------------------------------------------------|
| `apiKey`          | `process.env.BUGSNAG_API_KEY` | API Key obtained from Bugsnag dashboard project. **REQUIRED**                               |
| `enableReporting` | `undefined`                   | Set to `true` on environments or under conditions you want to report the errors to Bugsnag. |

For additional options check [here](https://docs.bugsnag.com/platforms/javascript/configuration-options/).

## License

Licensed under MIT.
