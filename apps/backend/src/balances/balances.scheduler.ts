import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { Queue } from 'bull'
import { BALANCES_QUEUE, JOB_BALANCES_CHUNK_BIG_JOB } from './balances.constant'

@Injectable()
export class BalancesScheduler {
  constructor(@InjectQueue(BALANCES_QUEUE) private balancesQueue: Queue) {}

  @Cron('2 0 * * *')
  async chunkBigJob() {
    this.balancesQueue.add(
      JOB_BALANCES_CHUNK_BIG_JOB,
      {},
      { removeOnComplete: true, removeOnFail: false }
    )
  }
}
