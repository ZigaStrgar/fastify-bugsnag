import Fastify from 'fastify'
import { strictEqual, ok } from 'assert/strict'
import { spy } from 'sinon'

import plugin from '../src/index'

const apiKey = '00000000000000000000000000000000'

describe('fastify-bugsnag', function () {
  it('decorates the fastify instance and request object', function () {
    const fastify = Fastify()

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fastify.register(plugin, {
      apiKey
    })

    fastify.ready(err => {
      strictEqual(err, undefined)

      ok(fastify.hasDecorator('bugsnag'))
      ok(fastify.hasRequestDecorator('bugsnag'))

      strictEqual(typeof fastify.bugsnag.notify, 'function')
    })

    void fastify.close()
  })

  it('add request details to the error', async function () {
    const fastify = Fastify()
    await fastify.register(plugin, {
      apiKey
    })
    fastify.get('/error', () => {
      throw new Error('test')
    })
    await fastify.ready()

    const notifySpy = spy(fastify.bugsnag, 'notify')
    await fastify.inject({
      url: '/error',
      method: 'GET'
    })

    strictEqual(notifySpy.callCount, 1)

    await fastify.close()
  })
})
