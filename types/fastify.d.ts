import 'fastify'

declare module 'fastify' {
  interface FastifyReply {
    json: (data?: object | string | number | boolean | null, status?: number, message?: string | null) => void
  }
}
