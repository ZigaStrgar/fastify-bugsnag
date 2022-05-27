import { Event, Logger } from '@bugsnag/core'
import { Client, Config } from '@bugsnag/js'
import { FastifyRequest } from 'fastify'

type AfterErrorCb = (err: any, event: Event, logger: Logger) => void

interface BugsnagNodeConfig extends Config {
  hostname?: string
  onUncaughtException?: AfterErrorCb
  onUnhandledRejection?: AfterErrorCb
  agent?: any
  projectRoot?: string
  sendCode?: boolean
}

export interface PluginOptions extends BugsnagNodeConfig {
  enableReporting?: boolean
}

export interface RequestMetadata {
  body?: FastifyRequest['body']
  clientIp: string
  headers: Record<string, any>
  httpMethod: string
  params?: unknown
  path: string
  query?: unknown
  referer?: string
  url: string
}

export interface RequestInfoWithMetadata {
  metadata: RequestMetadata
  request: Pick<RequestMetadata, 'clientIp' | 'headers' | 'httpMethod' | 'referer' | 'url'>
}

declare module 'fastify' {
  interface FastifyInstance {
    bugsnag: Client
  }

  interface FastifyRequest {
    bugsnag: Client
  }
}
