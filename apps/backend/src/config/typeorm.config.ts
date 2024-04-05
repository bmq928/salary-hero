import { registerAs } from '@nestjs/config'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import * as joi from 'joi'
import { DataSourceOptions } from 'typeorm'

export const TYPEORM_CONFIG_TOKEN = 'typeorm'

export const typeormConfig = registerAs(
  TYPEORM_CONFIG_TOKEN,
  (): DataSourceOptions => ({
    type: (process.env['TYPEORM_TYPE'] ?? 'postgres') as any,
    host: process.env['TYPEORM_HOST'],
    port: parseInt(process.env['TYPEORM_PORT'] as string),
    username: process.env['TYPEORM_USERNAME'],
    password: process.env['TYPEORM_PASSWORD'],
    schema: process.env['TYPEORM_SCHEMA'] ?? 'public',
    database: process.env['TYPEORM_DATABASE'],
    loggerLevel: (process.env['TYPEORM_LOGGER_LEVEL'] ?? 'error') as any,
    logging: process.env['TYPEORM_LOGGING'] === 'true',
    synchronize: process.env['TYPEORM_SYNCHRONIZE'] === 'true',
    namingStrategy: new SnakeNamingStrategy(),
  })
)
export const typeormConfigSchema = joi.object({
  TYPEORM_TYPE: joi
    .string()
    .valid(
      'aurora-mysql',
      'aurora-postgres',
      'better-sqlite3',
      'capacitor',
      'cockroachdb',
      'cordova',
      'expo',
      'mongodb',
      'mysql',
      'nativescript',
      'oracle',
      'postgres',
      'react-native',
      'sap',
      'spanner',
      'sqlite',
      'sqlite-abstract',
      'sqljs',
      'sqlserver'
    )
    .default('postgres'),
  TYPEORM_HOST: joi.string().hostname().required(),
  TYPEORM_PORT: joi.number().port().required(),
  TYPEORM_DATABASE: joi.string().required(),
  TYPEORM_USERNAME: joi.string().required(),
  TYPEORM_PASSWORD: joi.string().required(),
  TYPEORM_SCHEMA: joi.string().default('public'),
  TYPEORM_LOGGER_LEVEL: joi
    .string()
    .valid('debug', 'error', 'warn', 'info')
    .default('error'),
  TYPEORM_LOGGING: joi.string().valid('true', 'false').default('false'),
  TYPEORM_SYNCHRONIZE: joi.string().valid('true', 'false').default('false'),
})
