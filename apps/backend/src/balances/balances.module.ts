import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WorkerEntity } from '../workers'
import { BALANCES_QUEUE } from './balances.constant'
import { BalancesProcessor } from './balances.processor'
import { BalancesScheduler } from './balances.scheduler'

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkerEntity]),
    BullModule.registerQueue({ name: BALANCES_QUEUE }),
  ],
  providers: [BalancesScheduler, BalancesProcessor],
})
export class BalancesModule {}
