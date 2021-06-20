const Bugsnag = require('@bugsnag/js')
const fp = require('fastify-plugin')

function extractRequestMetadata (request) {
  return {
    body: request.body,
    clientIp: request.ips && request.ips[0] ? request.ips[0] : request.ip,
    headers: request.raw.headers,
    httpMethod: request.routerMethod,
    params: request.params,
    path: request.routerPath,
    query: request.query,
    referer: request.raw.headers.referer,
    url: request.url
  }
}

function obtainRequestAndMetadataInfo (request) {
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

function bugsnagPlugin (fastify, options, done) {
  Bugsnag.start({
    apiKey: options.key ? options.key : process.env.BUGSNAG_API_KEY,
    ...(options.bugsnagOptions || {})
  })

  fastify.decorate('bugsnag', Bugsnag)
  fastify.decorateRequest('bugsnag', null)

  fastify.addHook('onRequest', function decorateRequestInstance (request, reply, next) {
    request.bugsnag = Bugsnag

    next()
  })

  fastify.addHook('onError', function bugsnagErrorHandlerPlugin (request, reply, error, next) {
    if (options.enableReporting) {
      this.bugsnag.notify(error, event => {
        const { metadata, request: requestData } = obtainRequestAndMetadataInfo(request)
        event.request = requestData

        event.addMetadata('request', metadata)
      })
    }

    next()
  })

  done()
}

module.exports = fp(bugsnagPlugin, {
  name: 'fastify-bugsnag',
  fastify: '>=3.x'
})
