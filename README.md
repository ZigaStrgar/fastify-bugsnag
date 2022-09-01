# Fastify Bugsnag Plugin

[![NPM version](https://img.shields.io/npm/v/fastify-bugsnag.svg?style=flat)](https://www.npmjs.com/package/fastify-bugsnag)
![CI workflow](https://github.com/ZigaStrgar/fastify-bugsnag/workflows/fastify-bugsnag-ci/badge.svg)
[![Known Vulnerabilities](https://snyk.io/test/github/ZigaStrgar/fastify-bugsnag/badge.svg)](https://snyk.io/test/github/ZigaStrgar/fastify-bugsnag)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://standardjs.com/)
[![Test Coverage](https://api.codeclimate.com/v1/badges/ad24873a9f9078ff0b04/test_coverage)](https://codeclimate.com/github/ZigaStrgar/fastify-bugsnag/test_coverage)

Easily send your application errors to [Bugsnag](https://bugsnag.com) from your [Fastify](https://www.fastify.io/)
server.

## Description

The plugin will decorate `FastifyInstance` and `FastifyRequest` with `bugsnag` property. The value behind `bugsnag`, is
a full BugsnagClient. [Bugsnag documentation](https://docs.bugsnag.com/platforms/javascript/).

To the `FastifyInstance` is attached also an `onError` handler, which will send all the errors directly to your Bugsnag
dashboard. In the similar fashion as it's done by the official `@bugsnag/plugin-express`.

⚠️ Plugin Behaviour ⚠️

Be aware that the plugin mimics the behaviour of
official [Bugsnag Express](https://github.com/bugsnag/bugsnag-js/tree/next/packages/plugin-express) plugin with
appending
the request data to the error. That includes `body`, `query` and `params` which may include user data!

## Compatibility

|         | Version     |
|---------|-------------|
| Fastify | `^4.x`      |
| Bugsnag | `^7.17.0`   |
| Node    | `>=14.19.2` |

For Fastify V3 please check the version `v0.5.x`.

## Installation

```shell
npm install fastify-bugsnag --save

# OR

yarn add fastify-bugsnag
```

## Usage

```javascript
// Javascript
// index.js
const fastify = require('fastify')();

fastify.register(require('fastify-bugsnag'), {
  apiKey: 'Your-Bugsnag-API-Key', // Defaults to process.env.BUGSNAG_API_KEY
  // Rest of Bugsnag Configuration Options
});

// Typescript/ESM
// index.ts
import fastify from 'fastify';
import fastifyBugsnag from 'fastify-bugsnag';

fastify.register(fastifyBugsnag, {
  apiKey: 'Your-Bugsnag-API-Key', // Defaults to process.env.BUGSNAG_API_KEY
  // Rest of Bugsnag Configuration Options
});
```

```javascript
// routes.ts
fastify.get('/', async (request, reply) => {
  fastify.bugsnag.leaveBreadcrumb('Visited homepage'); // OR request.bugsnag.leaveBreadcrumb();
});

fastify.get('/error', async (request, reply) => {
  request.bugsnag.notify(new Error('This is a generic error'));
});
```

## Options

| Parameter | Default Value                 | Description                                                   |
|-----------|-------------------------------|---------------------------------------------------------------|
| `apiKey`  | `process.env.BUGSNAG_API_KEY` | API Key obtained from Bugsnag dashboard project. **REQUIRED** |

For additional options check the official documentation of Bugsnag
[here](https://docs.bugsnag.com/platforms/javascript/configuration-options/).

## License

Licensed under [MIT](./LICENSE).
