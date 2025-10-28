import type { NodeConfig } from '@bugsnag/node'
import type { FastifyRequest } from 'fastify'

export type PluginOptions = NodeConfig

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
