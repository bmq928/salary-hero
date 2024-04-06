import { InjectQueue, Process, Processor } from '@nestjs/bull'
import { Inject } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Job, Queue } from 'bull'
import {
  differenceInDays,
  format,
  getDaysInMonth,
  startOfToday,
} from 'date-fns'
import * as _ from 'lodash'
import { Repository } from 'typeorm'
import { batchConfig } from '../config'
import { SalaryType, WorkerEntity } from '../workers'
import {
  BALANCES_QUEUE,
  JOB_BALANCES_CHUNK_BIG_JOB,
  JOB_BALANCES_UPDATE,
} from './balances.constant'

type HandleBalancePayload = {
  offset: number
  limit: number
}

@Processor(BALANCES_QUEUE)
export class BalancesProcessor {
  constructor(
    @Inject(batchConfig)
    private readonly batchEnv: ConfigType<typeof batchConfig>,
    @InjectRepository(WorkerEntity)
    private readonly workersRepo: Repository<WorkerEntity>,
    @InjectQueue(BALANCES_QUEUE) private balancesQueue: Queue
  ) {}

  @Process(JOB_BALANCES_CHUNK_BIG_JOB)
  async chunkBigJob(): Promise<void> {
    const total = await this.workersRepo.count()
    const chunkSize = Math.floor(total / this.batchEnv.workerParallelNumber)
    const chunks = _.range(0, total, chunkSize)
    const jobIdPrefix = format(startOfToday(), 'MM_dd_yyyy')

    // number of chunk is less than 10 (src/config/batch.config.ts)
    // it is safe to bulk add
    await this.balancesQueue.addBulk(
      chunks.map((offset) => ({
        name: JOB_BALANCES_UPDATE,
        data: {
          offset,
          limit: chunkSize,
        },
        opts: {
          removeOnComplete: true,
          removeOnFail: false,
          jobId: `${jobIdPrefix}_${offset}`,
        },
      }))
    )
  }

  @Process(JOB_BALANCES_UPDATE)
  async handleBalancesUpdate(job: Job<HandleBalancePayload>): Promise<void> {
    const { offset, limit } = job.data
    const batchSize = this.batchEnv.workerPerUpdate
    const updateTime = startOfToday()

    let progress: number = await job.progress()
    while (progress < limit) {
      const batch = await this.workersRepo.find({
        take: batchSize,
        skip: offset,
        order: { createdAt: 'desc' },
      })
      const updatingWorkers = batch
        .map((w) => [w, differenceInDays(w.updatedAt, updateTime)] as const)
        .filter(([, workDays]) => workDays > 0)
        .map(([entity, workDays]) =>
          this.workersRepo.create({
            ...entity,
            balance:
              entity.salaryType === SalaryType.DAILY
                ? entity.balance + workDays * entity.salary
                : entity.balance +
                  (workDays * entity.salary) / getDaysInMonth(updateTime),
          })
        )

      await this.workersRepo.save(updatingWorkers)
      await job.progress((progress += batch.length))
    }
  }
}
