import { registerAs } from '@nestjs/config'
import * as joi from 'joi'

export interface BatchConfig {
  workerPerUpdate: number
  workerParallelNumber: number
}

export const BATCH_CONFIG_TOKEN = 'batch'

export const batchConfig = registerAs(
  BATCH_CONFIG_TOKEN,
  (): BatchConfig => ({
    workerPerUpdate: parseInt(process.env['BATCH_WORKER_PER_UPDATE'] ?? '100'),
    workerParallelNumber: parseInt(
      process.env['BATCH_WORKER_PARALLEL_NUMBER'] ?? '3'
    ),
  })
)

export const batchConfigSchema = joi.object({
  BATCH_WORKER_PER_UPDATE: joi.number().default(300).min(1).integer(),
  BATCH_WORKER_PARALLEL_NUMBER: joi
    .number()
    .default(3)
    .min(1)
    .max(10)
    .integer(),
})
