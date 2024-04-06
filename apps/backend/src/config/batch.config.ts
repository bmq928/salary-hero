import { registerAs } from '@nestjs/config'
import * as joi from 'joi'

export interface BatchConfig {
  workerPerUpdate: number
}

export const BATCH_CONFIG_TOKEN = 'batch'

export const batchConfig = registerAs(
  BATCH_CONFIG_TOKEN,
  (): BatchConfig => ({
    workerPerUpdate: parseInt(process.env['BATCH_WORKER_PER_UPDATE'] ?? '300'),
  })
)

export const batchConfigSchema = joi.object({
  BATCH_WORKER_PER_UPDATE: joi.number().default(300),
})
