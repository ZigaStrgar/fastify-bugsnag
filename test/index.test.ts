import Fastify from 'fastify'
import { test, mock } from 'tap'

import plugin from '../src/index'
import { Event } from '@bugsnag/js'

const apiKey = '00000000000000000000000000000000'

// eslint-disable-next-line @typescript-eslint/no-floating-promises
test('Plugin decorates the instance and request', async t => {
  t.plan(4)

  const fastify = Fastify()
  await fastify.register(plugin, {
    apiKey
  })

  fastify.ready(err => {
    t.error(err)

    t.ok(fastify.hasDecorator('bugsnag'))
    t.ok(fastify.hasRequestDecorator('bugsnag'))

    t.type(fastify.bugsnag.notify, Function)
  })
})

// eslint-disable-next-line @typescript-eslint/no-floating-promises
test('Throw an error in handler and add request details to the error', async t => {
  t.plan(1)

  const errors: Event[] = []

  const mockedPlugin = mock('../src/index', {
    '@bugsnag/js': {
      start: () => {
      },
      notify: (error: Event, event: Function) => {
        errors.push(error)
        event(error)
      }
    }
  })

  const fastify = Fastify()
  await fastify.register(mockedPlugin, {
    apiKey,
    enableReporting: true
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
