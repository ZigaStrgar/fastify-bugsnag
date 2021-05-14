# Fastify Bugsnag Plugin

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
    bugsnagOptions: {
        appType: 'web',
    }
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

## Options

| Parameter | Default Value | Description |
| --------- | ------------- | ----------- |
| `apiKey`  | `process.env.BUGSNAG_API_KEY` | API Key obtained from Bugsnag dashboard project. **REQUIRED** |
| `enableReporting` | `undefined` | Set to `true` on environemnts or under conditions you want to report the errors to Bugsnag. |
| `bugsnagOptions` | `{}` | [Additional configuration options](https://docs.bugsnag.com/platforms/javascript/configuration-options/) for Bugsnag Client. |

## License

Licensed under MIT.
