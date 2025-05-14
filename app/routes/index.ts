import { DoneFuncWithErrOrRes, FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify'
import RouteV1 from '#app/routes/v1'

export default function (app: FastifyInstance, opts: FastifyPluginOptions, done: DoneFuncWithErrOrRes) {
  app.get('/', (request: FastifyRequest, reply: FastifyReply) => reply.json({ ok: true }))

  app.register(RouteV1, { prefix: '/v1' })

  done()
}
