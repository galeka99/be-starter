import { DoneFuncWithErrOrRes, FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import cors from '@fastify/cors'
import AppException from '#app/exceptions/app_exception'
import fastifyMultipart from '@fastify/multipart'

const FastifyUtil = {
  setErrorHandler: function (fastify: FastifyInstance) {
    fastify.setErrorHandler(function (error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
      if (error instanceof AppException) {
        return reply.json(null, error.status, error.message)
      } else if (error instanceof Error) {
        fastify.log.error(error.stack ?? error, error.message ?? 'UNKNOWN ERROR OCCURED')

        return reply.json(null, 500, error.message ?? 'An error occured on the system')
      } else {
        fastify.log.error(error, 'UNKNOWN ERROR OCCURED')

        return reply.json(null, 500, 'An error occured on the system')
      }
    })
  },

  registerCors: function (fastify: FastifyInstance) {
    return fastify.register(cors, {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
      ],
    })
  },

  decorateJsonReply: function (fastify: FastifyInstance) {
    return fastify.decorateReply('json', function (this: FastifyReply, data: object | string | number | boolean | null = null, status = 200, message: string | null = null) {
      this.status(status).send({
        status,
        message,
        data,
      })
    })
  },

  jsonParser: function (fastify: FastifyInstance) {
    return fastify.addContentTypeParser('application/json', { parseAs: 'string' }, function (request: FastifyRequest, body: string | Buffer<ArrayBufferLike>, done: DoneFuncWithErrOrRes) {
      try {
        const json = JSON.parse(body as string)
        done(null, json)
      } catch (_) {
        throw new AppException(400, 'Error while parsing JSON request body')
      }
    })
  },

  multipartHandler: function (fastify: FastifyInstance) {
    return fastify.register(fastifyMultipart, {
      attachFieldsToBody: 'keyValues',
      limits: {
        fileSize: 512000,
      }
    })
  },

  transformMultipart: function (fastify: FastifyInstance) {
    return fastify.addHook('preValidation', function (request: FastifyRequest, reply: FastifyReply, done: DoneFuncWithErrOrRes) {
      const data = request.body as any
      const result = {}

      for (const flatKey in data) {
        const value = data[flatKey]
        const keys = flatKey.split('.')

        keys.reduce((acc, curr: any, index) => {
          const isLast = index === keys.length - 1
          const nextKey: any = keys[index + 1]
          const isArrayIndex = !isNaN(curr)

          const key = isArrayIndex ? parseInt(curr) : curr

          if (isLast) {
            acc[key] = value

            return
          }

          const shouldBeArray = !isNaN(nextKey)

          if (!acc[key]) {
            acc[key] = shouldBeArray ? [] : {}
          }

          return acc[key]
        }, result)
      }

      request.body = result

      done()
    })
  },
}

export default FastifyUtil
