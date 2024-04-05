import { registerAs } from '@nestjs/config'
import * as joi from 'joi'

export interface BaseConfig {
  port: number
  host: string
  nodeEnv: string
  basePath: string
}

export const BASE_CONFIG_TOKEN = 'base'

export const baseConfig = registerAs(
  BASE_CONFIG_TOKEN,
  (): BaseConfig => ({
    port: parseInt(process.env['PORT'] ?? '3000'),
    host: process.env['HOST'] ?? '0.0.0.0',
    nodeEnv: process.env['NODE_ENV'] ?? 'development',
    basePath: process.env['BASE_PATH'] ?? '/',
  })
)

export const baseConfigSchema = joi.object({
  PORT: joi.number().less(4000).greater(2999).default(3000),
  HOST: joi.string().hostname().default('0.0.0.0'),
  BASE_PATH: joi.string().default('/'),
  NODE_ENV: joi
    .string()
    .valid('dev', 'development', 'prod', 'production', 'test')
    .default('production'),
})
