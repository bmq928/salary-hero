import { registerAs } from '@nestjs/config'
import * as joi from 'joi'

export interface BullConfig {
  host: string
  port: number
}

export const BULL_CONFIG_TOKEN = 'bull'

export const bullConfig = registerAs(
  BULL_CONFIG_TOKEN,
  (): BullConfig => ({
    host: process.env['BULL_REDIS_HOST'] as string,
    port: parseInt(process.env['BULL_REDIS_PORT']),
  })
)

export const bullConfigSchema = joi.object({
  BULL_REDIS_HOST: joi.string().hostname().required(),
  BULL_REDIS_PORT: joi.number().port().required(),
})
