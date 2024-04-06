import { InjectQueue } from '@nestjs/bull'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { Cron } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'
import { Queue } from 'bull'
import { Repository } from 'typeorm'
import { batchConfig } from '../config'
import { WorkerEntity } from '../workers'
import { BALANCES_QUEUE } from './balances.constant'

@Injectable()
export class BalancesScheduler {
  constructor(
    @InjectQueue(BALANCES_QUEUE) private balancesQueue: Queue,
    @Inject(batchConfig)
    private readonly batchEnv: ConfigType<typeof batchConfig>,
    @InjectRepository(WorkerEntity)
    private readonly workersRepo: Repository<WorkerEntity>
  ) {}

  @Cron('0 0 * * *')
  async updateBalances() {
    const total = await this.workersRepo.count()
  }
}
