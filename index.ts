import Fastify, { DoneFuncWithErrOrRes, FastifyReply, FastifyRequest } from 'fastify'
import cors from '@fastify/cors'
import errorHandler from '#app/exceptions/error_handler'
import AppException from '#app/exceptions/app_exception'
import routes from '#app/routes/index'
import AppConfig from '#app/configs/app'

const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:mm:ss Z',
        ignore: 'pid,hostname',
      }
    }
  },
})

// REGISTER CORS
fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
})

// REGISTER JSON RESPONSE HELPER
fastify.decorateReply('json', function (this: FastifyReply, data: object | string | number | boolean | null = null, status = 200, message: string | null = null) {
  this.status(status).send({
    status,
    message,
    data,
  })
})

// SET DEFAULT ERROR HANDLER
fastify.setErrorHandler(errorHandler)

// REGISTER JSON PARSER
fastify.addContentTypeParser('application/json', { parseAs: 'string' }, function (request: FastifyRequest, body: string | Buffer<ArrayBufferLike>, done: DoneFuncWithErrOrRes) {
  try {
    const json = JSON.parse(body as string)
    done(null, json)
  } catch (_) {
    throw new AppException(400, 'Error while parsing JSON request body')
  }
})

// REGISTER ROUTES
fastify.register(routes)

// START THE SERVICE
fastify.listen({ port: AppConfig.app.port }, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
