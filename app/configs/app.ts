import dotenv from 'dotenv'

dotenv.config()

const AppConfig = {
  app: {
    name: process.env.APP_NAME,
    host: process.env.APP_HOST ?? '0.0.0.0',
    port: parseInt(process.env.APP_PORT ?? '3000'),
  },
}

export default AppConfig
