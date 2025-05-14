import Fastify from 'fastify'
import routes from '#app/routes/index'
import AppConfig from '#app/configs/app'
import FastifyUtil from '#app/utils/fastify'
import { ajvFilePlugin } from '@fastify/multipart'

const fastify = Fastify({
  logger: {
    transport: {
      target: '@fastify/one-line-logger',
    },
  },
  ajv: {
    plugins: [
      ajvFilePlugin,
    ]
  }
})

const start = async function () {
  FastifyUtil.decorateJsonReply(fastify)
  FastifyUtil.setErrorHandler(fastify)
  FastifyUtil.jsonParser(fastify)
  await FastifyUtil.registerCors(fastify)
  await FastifyUtil.multipartHandler(fastify)
  FastifyUtil.transformMultipart(fastify)
  await fastify.register(routes)

  // Waiting for fastify server to ready
  await fastify.ready()

  // Start the server
  await fastify.listen({
    host: AppConfig.app.host,
    port: AppConfig.app.port,
  })
}

start()
