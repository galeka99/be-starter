import dotenv from 'dotenv'

dotenv.config()

const AppConfig = {
  app: {
    name: process.env.APP_NAME,
    port: parseInt(process.env.APP_PORT ?? '3000'),
  },
}

export default AppConfig
