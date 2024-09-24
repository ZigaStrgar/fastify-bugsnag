import type { Client, BrowserConfig } from '@bugsnag/js'
import type { NodeConfig } from '@bugsnag/node'
import type { FastifyRequest } from 'fastify'

export type PluginOptions = NodeConfig | BrowserConfig

export interface RequestMetadata {
  body?: FastifyRequest['body']
  clientIp: string
  headers: Record<string, any>
  httpMethod: string
  params?: unknown
  path?: string
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
