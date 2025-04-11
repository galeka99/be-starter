import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import AppException from '#app/exceptions/app_exception'

export default function (error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  if (error instanceof AppException) {
    reply.status(error.status).send({
      status: error.status,
      message: error.message,
      data: null,
    })
  } else if (error instanceof Error) {
    reply.status(500).send({
      status: 500,
      message: error.message ?? 'Terjadi kesalahan pada sistem',
      data: null,
    })
  } else {
    reply.status(500).send({
      status: 500,
      message: 'Terjadi kesalahan pada sistem',
      data: null,
    })
  }
}
