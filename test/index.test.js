'use strict'

const Fastify = require('fastify')
const { test, mock } = require('tap')
const plugin = require('../index')

const apiKey = '00000000000000000000000000000000'

test('Plugin decorates the instance and request', t => {
  t.plan(4)

  const fastify = Fastify()
  fastify.register(plugin, {
    apiKey
  })

  fastify.ready(err => {
    t.error(err)

    t.ok(fastify.hasDecorator('bugsnag'))
    t.ok(fastify.hasRequestDecorator('bugsnag'))

    t.type(fastify.bugsnag.notify, Function)
  })
})

test('Throw an error in handler and add request details to the error', async t => {
  t.plan(1)

  const errors = []

  const mockedPlugin = mock('../index', {
    '@bugsnag/js': {
      start: () => {},
      notify: (error, event) => {
        errors.push(error)
        event(error)
      }
    }
  })

  const fastify = Fastify()
  fastify.register(mockedPlugin, {
    apiKey,
    enableReporting: true,
  })

  fastify.get('/error', () => {
    throw new Error('Test')
  })

  await fastify.inject({
    url: '/error',
    method: 'GET'
  })

  const [error] = errors

  t.strictSame(error.request, {
    clientIp: '127.0.0.1',
    headers: { 'user-agent': 'lightMyRequest', host: 'localhost:80' },
    httpMethod: 'GET',
    referer: undefined,
    url: '/error'
  })
})
