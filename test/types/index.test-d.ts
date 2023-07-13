import { Client } from '@bugsnag/js'
import fastify from 'fastify'
import { expectType } from 'tsd'

import plugin from '../../src'

const app = fastify()

// eslint-disable-next-line @typescript-eslint/no-floating-promises
app.register(plugin).ready()

expectType<Client>(app.bugsnag)

app.get('/', request => {
    expectType<Client>(request.bugsnag)
})
