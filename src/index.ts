import Bugsnag, { type Client } from '@bugsnag/node'
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'

import type { PluginOptions, RequestInfoWithMetadata, RequestMetadata } from './types.js'

declare module 'fastify' {
  interface FastifyInstance {
    bugsnag: Client
  }

  interface FastifyRequest {
    bugsnag: Client
  }
}

function extractRequestMetadata (request: FastifyRequest): RequestMetadata {
  return {
    body: request.body,
    clientIp: request?.ips?.[0] ?? request.ip,
    headers: request.raw.headers,
    httpMethod: request.routeOptions.method.toString(),
    params: request.params,
    path: request.routeOptions.url,
    query: request.query,
    referer: request.raw.headers.referer,
    url: request.url
  }
}

function obtainRequestAndMetadataInfo (request: FastifyRequest): RequestInfoWithMetadata {
  const metadata = extractRequestMetadata(request)

  return {
    metadata,
    request: {
      clientIp: metadata.clientIp,
      headers: metadata.headers,
      httpMethod: metadata.httpMethod,
      referer: metadata.referer,
      url: metadata.url
    }
  }
}

function bugsnagPlugin (fastify: FastifyInstance, options: PluginOptions, done: (error?: Error) => void): void {
  Bugsnag.start(options)

  fastify.decorate('bugsnag', Bugsnag)
  fastify.decorateRequest('bugsnag')

  fastify.addHook('onRequest', function decorateRequestInstance (request: FastifyRequest, reply: FastifyReply, next) {
    request.bugsnag = Bugsnag

    next()
  })

  fastify.addHook('onError', async function bugsnagErrorHandlerPlugin (request: FastifyRequest, reply: FastifyReply, error) {
    this.bugsnag.notify(error, event => {
      const { metadata, request: requestData } = obtainRequestAndMetadataInfo(request)
      event.request = requestData

      event.addMetadata('request', metadata)
    })
  })

  done()
}

export default fp<PluginOptions>(bugsnagPlugin, {
  fastify: '5.x',
  name: 'fastify-bugsnag'
})
